import { useState } from 'react'
import './App.css'
import { MultiLanguageIDE } from './components/Ide'

function App() {
  const [count, setCount] = useState(0)

  return (
    <MultiLanguageIDE/>
  )
}

export default App
