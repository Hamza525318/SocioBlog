import React from 'react'
import { Link } from 'react-router-dom'
import "./Page.css";

function PageNotFoundInfo() {
  return (
    <div className='w-full md:w-1/2 justify-start items-center md:m-5'>
    <div>
       <h5 className='text-center md:text-left'>PAGE NOT FOUND</h5>
       <h1 className='font-bold font-poppins text-gray-500 header-1'>404</h1>
       <p className='font-bold font-poppins -my-4 header-2'>Out of nothing</p>
       <p className='font-bold font-poppins -my-4 header-2'>something</p>
       <p className='font-poppins para-1  mt-3 text-base text-center md:text-left p-0'>Looks like our wordsmiths were too absorbed in their novels to craft this page,While they search for inspiration, feel free to explore other chapters of our blog</p>
       <p className='text-center my-2 md:text-left'>Back to Home: <Link className='underline font-bold'>Home</Link></p>
    </div>
    </div>
  )
}

export default PageNotFoundInfo