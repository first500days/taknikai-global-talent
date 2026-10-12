import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import { TallyPopupProvider } from './components/TallyPopup'
import { RouterProvider, useLocation } from './lib/router'

// The React app renders the homepage only. Upskill, About Us, Blogs and the articles are static pages built from
// the original site by scripts/build-site.mjs; this app also serves as the 404 page (dist/404.html).
function Routes() {
  const { path } = useLocation()
  return path === '/' ? <HomePage /> : <NotFoundPage />
}

export default function App() {
  return (
    <RouterProvider>
      <MotionConfig reducedMotion="user">
        <TallyPopupProvider>
          <Navbar />
          <main id="main">
            <Routes />
          </main>
          <Footer />
        </TallyPopupProvider>
      </MotionConfig>
    </RouterProvider>
  )
}
