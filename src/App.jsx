import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { LanguageProvider } from './context/LanguageContext'
import { TourPricesProvider } from './context/TourPricesContext'
import { NavigationGuardProvider } from './context/NavigationGuardContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import PaymentCarousel from './components/PaymentCarousel'
import About from './components/About'
import Tours from './components/Tours'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import TourDetail from './pages/TourDetail'
import Reservar from './pages/Reservar'
import GalleryEjemplo from './pages/GalleryEjemplo'
import GalleryEjemplo2 from './pages/GalleryEjemplo2'
import HeaderEjemploPage from './pages/HeaderEjemploPage'
import HeaderEjemplo2Page from './pages/HeaderEjemplo2Page'
import HeaderEjemplo3Page from './pages/HeaderEjemplo3Page'
import HeaderEjemplo4Page from './pages/HeaderEjemplo4Page'
import HeaderEjemplo5Page from './pages/HeaderEjemplo5Page'

function HomePage() {
  return (
    <>
      <Hero />
      <PaymentCarousel />
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

function AppShell() {
  const { pathname } = useLocation()
  const isHeaderDemo = pathname.startsWith('/ejemplo-header')

  return (
    <>
      {!isHeaderDemo && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inicio" element={<SectionPage anchor="#inicio" />} />
        <Route path="/nosotros" element={<SectionPage anchor="#nosotros" />} />
        <Route path="/tours" element={<SectionPage anchor="#tours" />} />
        <Route path="/galeria" element={<SectionPage anchor="#galeria" />} />
        <Route path="/contacto" element={<SectionPage anchor="#contacto" />} />
        <Route path="/tour/:id" element={<TourDetail />} />
        <Route path="/reservar/:id" element={<Reservar />} />
        <Route path="/ejemplo-galeria" element={<GalleryEjemplo />} />
        <Route path="/ejemplo-galeria-2" element={<GalleryEjemplo2 />} />
        <Route path="/ejemplo-header" element={<HeaderEjemploPage />} />
        <Route path="/ejemplo-header-2" element={<HeaderEjemplo2Page />} />
        <Route path="/ejemplo-header-3" element={<HeaderEjemplo3Page />} />
        <Route path="/ejemplo-header-4" element={<HeaderEjemplo4Page />} />
        <Route path="/ejemplo-header-5" element={<HeaderEjemplo5Page />} />
      </Routes>
      {!isHeaderDemo && <Footer />}
      {!isHeaderDemo && <WhatsAppFloat />}
    </>
  )
}

function App() {
  return (
    <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: 'USD', intent: 'capture', components: 'buttons' }}>
    <TourPricesProvider>
    <LanguageProvider>
      <BrowserRouter>
      <NavigationGuardProvider>
      <AppShell />
      </NavigationGuardProvider>
      </BrowserRouter>
    </LanguageProvider>
    </TourPricesProvider>
    </PayPalScriptProvider>
  )
}

export default App
