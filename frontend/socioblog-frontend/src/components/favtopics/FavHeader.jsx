import React from 'react'

function FavHeader() {
  return (
    <div className='w-full flex justify-center'>
       <div className='mt-4 w-[450px]'>
       <h1 className="font-bold z-10 text-center" style={{"fontSize":"40px"}}>SocioBlog</h1>
       <p className='font-medium font-poppins mt-8 text-center' style={{"fontSize":"24px"}} >What are you intrested in?</p>
       <p className='text-center my-2'>Choose three or more..</p>
       </div>
    </div>
  )
}
export default FavHeader