import React from 'react'
import RightSidebar from './RightSidebar'
import LeftSidebar from './LeftSidebar'
import Feed from './Feed'
 import { Outlet } from 'react-router-dom'
const Home = () => {
  return (
      <div className='flex justify-between w-[80%] mx-auto '>
          <LeftSidebar />
          <Outlet/>
          <RightSidebar />
          
      
      </div>
  )
}

export default Home