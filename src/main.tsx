import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ToastProvider, ToastViewport } from '@/components/ui/toast'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
      <ToastViewport />
    </ToastProvider>
  </React.StrictMode>
);
