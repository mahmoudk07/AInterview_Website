import React from 'react'
import { AvatarStack } from './AvatarStack'

const Interview = () => {
  return (
    <div className = 'w-full md:w-[32%] h-[280px] bg-red-500 px-[2%] py-[1%] rounded-[20px] bg-transparent border-[1px] border-borderColor'>
        <div className = 'w-full flex items-center justify-center'>
            <span className='text-white font-bold text-xl m-auto'>Frontend Interview</span>
        </div>
        <div className = 'flex flex-col justify-center gap-y-2 mt-[10px]'>
            <span className='text-white font-bold text-[18px]'>Date: <span className = 'text-gray-400 font-bold'>2024-04-05</span></span>
            <span className='text-white font-bold text-[18px]'>Time: <span className = 'text-gray-400 font-bold'>10:00AM</span></span>
            <span className='text-white font-bold text-[18px]'>Status: <span className='text-gray-400'>Upcoming</span></span>
            <div className = 'flex items-center mt-[5px]'>
                <div className = 'cursor-pointer' onClick = {() => console.log("here")}>
                    <AvatarStack />
                </div>
                <span className='text-white text-[14px] ml-[1.5%] font-bold'>32 Interviewees applied for an interview</span>
            </div>
            
            <div className = 'flex items-center justify-end mt-[15px] gap-5'>
                <button className = 'text-white bg-red-700 px-[3%] py-[1%] rounded-[20px] font-bold'>Delete</button>
                <button className = 'text-white bg-orange-600 px-[3%] py-[1%] rounded-[20px] font-bold'>Update</button>
            </div>
        </div> 
    </div>
  )
}
export default Interview