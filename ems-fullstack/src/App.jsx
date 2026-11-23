import { useEffect, useState } from 'react'
import './App.css'
import Header from './component/Header'
import ListEmployeeComponent from './component/ListEmployeeComponent'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EmployeeComponent from './component/EmployeeComponent'

function SplashScreen() {
  return (
    <main className="splash-screen" aria-label="Employee management system loading">
      <div className="splash-orbit splash-orbit-one" />
      <div className="splash-orbit splash-orbit-two" />
      <div className="splash-content">
        <div className="brand-mark splash-mark">E</div>
        <p className="eyebrow splash-eyebrow">PEOPLE · PURPOSE · PROGRESS</p>
        <h1>Employee<br />Management System</h1>
        <p className="splash-caption">A clearer way to care for your team.</p>
        <div className="splash-loader" aria-hidden="true"><span /></div>
      </div>
    </main>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const splashTimer = window.setTimeout(() => setShowSplash(false), 1500)
    return () => window.clearTimeout(splashTimer)
  }, [])

  if (showSplash) return <SplashScreen />

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <Routes>
          <Route path="/" element={<ListEmployeeComponent />} />
          <Route path="/emplist" element={<ListEmployeeComponent />} />
          <Route path="/add-employee" element={<EmployeeComponent />} />
          <Route path="/update-employee/:id" element={<EmployeeComponent />} />
        </Routes>
        <footer className="app-footer">Made for the people who make work happen.</footer>
      </div>
    </BrowserRouter>
  )
}

export default App
