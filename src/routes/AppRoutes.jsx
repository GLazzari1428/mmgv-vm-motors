import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Pages - import them here as you create them
// import { Home } from '@pages/Home'
// import { About } from '@pages/About'
// import { Dashboard } from '@pages/Dashboard'
// import { NotFound } from '@pages/NotFound'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  )
}
