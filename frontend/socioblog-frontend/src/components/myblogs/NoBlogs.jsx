import React from 'react'
import Navbar from '../Navbar'
import { Link } from 'react-router-dom'

function NoBlogs() {
  return (
    <section className='w-screen h-screen'>
        <Navbar/>
        <div className='w-full mt-[8%] flex justify-center items-center'>

            <img src='https://cdn-images-1.medium.com/v2/1*8rgW0Qvy2bSGSBMlORMhQA.png' className='w-[350px] object-cover'></img>
            <div className='ml-[80px]'>
                <h1 className='font-bold font-poppins text-2xl'>Start sharing your stories with the World 🌏</h1>
                <button className='my-4 py-2 px-10 font-poppins text-white bg-reddish-orange rounded-2xl'>
                    <Link to="/write-a-blog">start writing</Link>
                </button>
            </div>
        </div>
    </section>
  )
}

export default NoBlogs