import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Landing from './Landing'
import Signup from './Signup'
import Connections from './Connections'
import WebHookSetup from './WebHookSetup'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="/webhooksetup" element={<WebHookSetup />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
