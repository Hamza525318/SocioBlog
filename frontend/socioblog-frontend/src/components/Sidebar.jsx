import React from 'react'
import SingleCategory from './SingleCategory'
import {MdCardTravel, MdOutlineSportsSoccer} from "react-icons/md"
import {FaMobileAlt,FaBusinessTime,FaRobot, FaDollarSign} from "react-icons/fa"
import {MdHealthAndSafety,MdFastfood} from "react-icons/md"
import { BiSolidJoystick } from "react-icons/bi";
import { GiBrain } from "react-icons/gi";

function Sidebar() {
  
  const categories = [
    {iconName: <MdCardTravel size={25} color='white'/>, title:"travel"},
    {iconName: <FaMobileAlt  size={25} color='white'/>, title:"technology"},
    {iconName: <FaBusinessTime size={25} color='white'/>, title:"business"},
    {iconName: < MdHealthAndSafety size={25} color='white'/>, title:"health"},
    {iconName: <FaRobot size={25} color='white'/>, title:"artificial intelligence"},
    {iconName: <BiSolidJoystick size={25} color='white'/>, title:"gaming"},
    {iconName: <MdFastfood size={25} color='white'/>, title:"food"},
    {iconName: <FaDollarSign size={25} color='white'/>, title:"finance"},
    {iconName: <MdOutlineSportsSoccer size={25} color='white'/>, title:"sports"},
    {iconName: <GiBrain size={25} color='white'/>, title:"mental health"},

  ]

  return (
    <div className='w-1/5 h-screen bg-reddish-orange rounded-r-lg my-2'>
          <h3 className='text-center my-4 text-white font-semibold text-lg'>Categories</h3>
          <div>

            {categories.map((category,index)=>{
                return(
                  <SingleCategory key={index} iconName={category.iconName} title={category.title}/>
                )
            })}

         </div>
    </div>
  )
}

export default Sidebar