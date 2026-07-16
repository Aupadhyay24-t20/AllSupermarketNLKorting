import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import HomePage from './pages/HomePage'
import AanbiedingenPage from './pages/AanbiedingenPage'
import OverOnsPage from './pages/OverOnsPage'
import NotFoundPage from './pages/NotFoundPage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import GetAppPage from './pages/GetAppPage'
import { CookieBanner } from './components/ds/CookieBanner'
import { trackPageView } from './utils/analytics'

const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
}

function AnimatedRoutes() {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location.pathname + location.search)
  }, [location])

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...pageTransition}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/aanbiedingen" element={<AanbiedingenPage />} />
          <Route path="/over-ons" element={<OverOnsPage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />
          <Route path="/get-app" element={<GetAppPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <CookieBanner />
    </BrowserRouter>
  )
}
