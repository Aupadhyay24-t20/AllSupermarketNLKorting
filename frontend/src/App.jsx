import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AanbiedingenPage from './pages/AanbiedingenPage'
import OverOnsPage from './pages/OverOnsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aanbiedingen" element={<AanbiedingenPage />} />
        <Route path="/over-ons" element={<OverOnsPage />} />
      </Routes>
    </BrowserRouter>
  )
}