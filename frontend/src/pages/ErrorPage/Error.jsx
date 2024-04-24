import React from 'react'
import { useNavigate } from 'react-router-dom' 
import { FaFlag } from "react-icons/fa6";
const Error = () => {
    const navigate = useNavigate()
  return (
    <div className = 'w-full h-[100vh] flex justify-center items-center'>
        <div className = 'flex flex-col justify-start items-center'>
            <FaFlag className = 'text-white w-[200px] h-[100px] mb-[20px]' />
            <span className = 'text-white font-bold text-[36px]'>Error 404</span>
            <span className='text-white font-bold text-[36px]'>It looks like something went error </span>
            <button className = 'px-[4%] py-[2%] text-white font-bold border-[1px] border-borderColor rounded-[20px] cursor-pointer mt-[10px]' onClick={() => navigate('/')}>Back Home</button>
        </div>
    </div>
  )
}

export default Error