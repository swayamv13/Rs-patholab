import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// React Query client — 5 min stale time, 10 min cache
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppContextProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AppContextProvider>
    </BrowserRouter>
  </QueryClientProvider>
)
