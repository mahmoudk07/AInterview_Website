import React from 'react'
import Header from '../../../components/Header/Header'
import Interview from './Components/Interview'
const Interviews = () => {
  return (
    <div className = 'w-full min-h-[80vh] overflow-x-hidden mt-[100px]'>
        <Header />        
        <div className = 'flex items-center flex-wrap w-full min-h-[100px] px-[5%] py-[2%] gap-x-[2%] gap-y-6'>
            <Interview />
            <Interview />
            <Interview />
            <Interview />
        </div>
    </div>
  )
}

export default Interviews