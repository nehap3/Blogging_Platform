import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''; // Fallback to relative path for dev (proxy)
// Since we use proxy in vite.config, the origin is technically same, but let's ensure it.
// Actually, if we use proxy, the browser sees it as same origin (localhost:5173/api -> localhost:5173).
// So cookies SHOULD work if set on localhost.
// BUT, if backend set cookie on localhost:5000, and we are on localhost:5173, and we proxy...
// The proxy sends the request to 5000. 
// If the backend sets a cookie, it sets it for the domain in the request? 
// When using proxy: Client -> 5173 -> 5000. 
// Response 5000 -> 5173 -> Client.
// The cookie domain will be localhost.
// So sameSite: strict should work?
// Issue might be that I was using port 5179?
// Regardless, setting withCredentials=true is safe practice for auth.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
