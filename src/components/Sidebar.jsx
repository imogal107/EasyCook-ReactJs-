import React from 'react'
import { Link } from 'react-router-dom'
import { House , Heart } from 'lucide-react';

const Sidebar = () => {
  return (
   <>
     <DesktopSidebar/>
     <MobileSidebar/>
   </>
  )
}

export default Sidebar

const DesktopSidebar = () =>{
    return (

        <div className='bg-slate-800 text-white border-r-2 p-3 md:p-10  min-h-screen w-24 md:w-64 hidden sm:block'>
            <div className='flex flex-col sticky top-8 gap-7 md:gap-10 left-0'>
            <div className=' w-full h-40 flex justify-center'>
                <img src="/logo.svg" alt="logo"  className=' md:block  rounded-full filter hue-rotate-180 brightness-75 contrast-125 saturate-50'  />
            </div>
            <ul className='flex flex-col items-center md:items-start '>
                <Link to={"/"}  className='flex gap-1 mt-2 mb-2'>
                    <House size={24} absoluteStrokeWidth />
                    <span className=' font-bold hidden md:block'>Home</span>
                </Link>
                <Link to={"/favourites"}  className='flex gap-1 mt-2 mb-2'>
                    <Heart size={24} absoluteStrokeWidth />
                    <span className=' font-bold hidden md:block'>Favourites</span>
                </Link>             
            </ul>
            </div>
        </div>

    )
}

const MobileSidebar = () =>{
    return (

        <div className='flex justify-center border-t fixed w-full bottom-0 left-0 gap-10 p-2 bg-slate-800 text-white z-20 sm:hidden'>
    
        
                <Link to={"/"}  className='flex gap-1 mt-2 mb-2'>
                    <House size={24} absoluteStrokeWidth />
                    <span className=' font-bold hidden md:block'>Home</span>
                </Link>
                <Link to={"/favourites"}  className='flex gap-1 mt-2 mb-2'>
                    <Heart size={24} absoluteStrokeWidth />
                    <span className=' font-bold hidden md:block'>Favourites</span>
                </Link>             
      
        </div>

    )
}