import React from 'react'
import PageNotFoundNavbar from './PageNotFoundNavbar'
import Navbar from '../Navbar'
import PageNotFoundHeader from './PageNotFoundHeader'

function PageNotFound() {
  return (
    <div className='w-screen h-screen'>
        <PageNotFoundNavbar/>
        <PageNotFoundHeader/>
    </div>
  )
}

export default PageNotFound