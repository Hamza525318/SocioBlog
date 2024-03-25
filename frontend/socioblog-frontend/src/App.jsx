import './App.css'
import Navbar from './components/Navbar'
import BlogSection from './components/BlogSection'
import io from 'socket.io-client'
import { useEffect } from 'react'

function App() {

  return (
   <div className='w-screen'>

    <Navbar/>
    <BlogSection/>
    
   </div>
  )
}

export default App
