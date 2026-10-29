import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import ServicePage from './pages/ServicePage'
import GalleryPage from './pages/GalleryPage'
import { galleryPage } from './content/gallery'
import { servicePages } from './content/servicePages'
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
      <FAQ />
      <Footer />
    </div>
  )
}

// Shared by the browser (BrowserRouter) and the build-time prerenderer (StaticRouter).
export function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={galleryPage.path} element={<GalleryPage />} />
        {servicePages.map((page) => (
          <Route key={page.path} path={page.path} element={<ServicePage page={page} />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
