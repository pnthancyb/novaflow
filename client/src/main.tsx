import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { TranslationProvider } from '@/hooks/use-translation'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <ThemeProvider>
          <App />
          <Toaster />
        </ThemeProvider>
      </TranslationProvider>
    </QueryClientProvider>
  </StrictMode>,
)
