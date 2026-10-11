import { createContext, useContext, useState, type ReactNode } from 'react'

// The React app only renders the homepage (and the 404 page); every other URL is a static page.
// Links therefore use normal full-page navigation — this context just exposes the current path.

type Location = { path: string }

const RouterContext = createContext<Location>({ path: '/' })

const normalise = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p) || '/'

export function RouterProvider({ children }: { children: ReactNode }) {
  const [loc] = useState<Location>(() => ({ path: normalise(window.location.pathname) }))
  return <RouterContext.Provider value={loc}>{children}</RouterContext.Provider>
}

export const useLocation = () => useContext(RouterContext)
