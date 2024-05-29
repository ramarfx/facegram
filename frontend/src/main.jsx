import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { StateContextProvider } from './context/stateContext.jsx'
import './assets/bootstrap.css'
import './assets/style.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.jsx'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000/api/v1'
axios.defaults.headers.common.Accept = 'application/json'
axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${sessionStorage.getItem('token')}`
  return config;
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StateContextProvider>
      <RouterProvider router={router} />
    </StateContextProvider>
  </React.StrictMode>,
)
