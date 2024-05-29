import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Outlet } from 'react-router-dom'
import TopBar from './components/Topbar'
import { useStateContext } from './context/stateContext'

function App() {
  const { token } = useStateContext()
  return (
    <>
      <TopBar />

      {token ? <Outlet /> : <Navigate to={'/login'} />}
    </>
  )
}

export default App
