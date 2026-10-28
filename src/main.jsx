import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Pages are prerendered at build time; hydrate them. In dev there is no prerendered markup.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
