import React from 'react'
import PageNotFoundInfo from './PageNotFoundInfo'
import './Page.css';

function PageNotFoundHeader() {
  return (
    <div className='w-full flex flex-col md:flex-row'>
         <div className='image-div w-full flex  md:w-1/2 justify-end'>
          <img src='https://cdn-images-1.medium.com/v2/1*8rgW0Qvy2bSGSBMlORMhQA.png' className='my-6 mr-16 img-1' style={{"width":"450px"}} alt='404'>

          </img>
         </div>
        <PageNotFoundInfo/>
    </div>
  )
}

export default PageNotFoundHeader