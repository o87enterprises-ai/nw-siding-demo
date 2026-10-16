import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ServiceAgreementGate from './components/ServiceAgreementGate'
import { O87Watermark } from './components/O87'

function HomePage() {
  return (
    <div style={{ position: 'relative' }}>
      <O87Watermark />
      <Hero />
      <Contact />
      <Stats />
      <Services />
      <Portfolio />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ServiceAgreementGate>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ServiceAgreementGate>
    </BrowserRouter>
  )
}
