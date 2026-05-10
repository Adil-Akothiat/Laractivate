// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import QueryClientProviderWrapper from './app/providers/QueryClientProvider.tsx'
import App from './app/routes/index.tsx'
import { ToastProvider } from './app/providers/ToastProvider.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <QueryClientProviderWrapper>
      <ToastProvider>
        <App />
      </ToastProvider>
    </QueryClientProviderWrapper>
  // </StrictMode>,
)