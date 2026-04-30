import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { LanguageProvider } from './context/LanguageContext'
import { TourPricesProvider } from './context/TourPricesContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Tours from './components/Tours'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import TourDetail from './pages/TourDetail'
import Reservar from './pages/Reservar'

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Tours />
      <Gallery />
      <Contact />
    </>
  )
}

function SectionPage({ anchor }) {
  useEffect(() => {
    setTimeout(() => {
      document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
  }, [anchor])
  return <HomePage />
}

function App() {
  return (
    <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: 'USD', intent: 'capture', components: 'buttons' }}>
    <TourPricesProvider>
    <LanguageProvider>
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inicio" element={<SectionPage anchor="#inicio" />} />
        <Route path="/nosotros" element={<SectionPage anchor="#nosotros" />} />
        <Route path="/tours" element={<SectionPage anchor="#tours" />} />
        <Route path="/galeria" element={<SectionPage anchor="#galeria" />} />
        <Route path="/contacto" element={<SectionPage anchor="#contacto" />} />
        <Route path="/tour/:id" element={<TourDetail />} />
        <Route path="/reservar/:id" element={<Reservar />} />
      </Routes>
      <Footer />
      <WhatsAppFloat />
      </BrowserRouter>
    </LanguageProvider>
    </TourPricesProvider>
    </PayPalScriptProvider>
  )
}

export default App
