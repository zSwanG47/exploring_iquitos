function getPayPalBaseUrl() {
  const mode = (process.env.PAYPAL_MODE || 'live').toLowerCase()
  return mode === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com'
}

function getPayPalCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.VITE_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal credentials')
  }

  return { clientId, clientSecret }
}

async function getAccessToken() {
  const { clientId, clientSecret } = getPayPalCredentials()
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const res = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    throw new Error('PayPal authentication failed')
  }

  const data = await res.json()
  return data.access_token
}

function getCapturedAmount(order) {
  const unit = order?.purchase_units?.[0]
  const capture = unit?.payments?.captures?.[0]
  return {
    value: capture?.amount?.value ?? unit?.amount?.value,
    currency: capture?.amount?.currency_code ?? unit?.amount?.currency_code,
  }
}

export async function captureAndVerifyOrder(orderId, expectedTotalUsd) {
  const token = await getAccessToken()
  const base = getPayPalBaseUrl()

  const captureRes = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  const order = await captureRes.json()

  if (!captureRes.ok) {
    // Orden ya capturada: consultar estado actual
    if (order?.details?.some((d) => d.issue === 'ORDER_ALREADY_CAPTURED')) {
      const orderRes = await fetch(`${base}/v2/checkout/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!orderRes.ok) throw new Error('PayPal order lookup failed')
      return verifyOrderAmount(await orderRes.json(), expectedTotalUsd)
    }
    throw new Error('PayPal capture failed')
  }

  return verifyOrderAmount(order, expectedTotalUsd)
}

function verifyOrderAmount(order, expectedTotalUsd) {
  if (order.status !== 'COMPLETED') {
    throw new Error('PayPal payment not completed')
  }

  const { value, currency } = getCapturedAmount(order)
  const paid = Number(value)
  const expected = Number(Number(expectedTotalUsd).toFixed(2))

  if (currency !== 'USD') {
    throw new Error('Invalid PayPal currency')
  }

  if (!Number.isFinite(paid) || Math.abs(paid - expected) > 0.01) {
    throw new Error('PayPal amount mismatch')
  }

  return { orderId: order.id, paidAmount: paid }
}
