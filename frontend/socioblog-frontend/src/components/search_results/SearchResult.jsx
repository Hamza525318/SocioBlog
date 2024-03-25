import React from 'react'
import Navbar from "../Navbar"
import SearchBlogs from './SearchBlogs'

function SearchResult() {
  return (
    <section className='w-screen'>
      <Navbar/>
      <SearchBlogs/>
    </section>
  )
}

export default SearchResult