import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AvatarStack } from './AvatarStack'
import { InterviewsContext } from '../Interviews'
import axios from "axios"
const Interview = ({ id, title, Date, Time, status, interviewees }) => {
    const { setShowModal } = useContext(InterviewsContext)
    const navigate = useNavigate()
    const deleteInterview = async () => {
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/interview/delete_interview/${id}`).then((response) => { console.log(response); setShowModal(true) }).catch((error) => console.log(error))
    }
  return (
    <div className = 'w-full md:w-[32%] h-[280px] bg-red-500 px-[2%] py-[1%] rounded-[20px] bg-transparent border-[1px] border-borderColor'>
        <div className = 'w-full flex items-center justify-center'>
              <span className='text-white font-bold text-xl m-auto'>{title}</span>
        </div>
        <div className = 'flex flex-col justify-center gap-y-2 mt-[10px]'>
              <span className='text-white font-bold text-[18px]'>Date: <span className='text-gray-400 font-bold'>{Date}</span></span>
              <span className='text-white font-bold text-[18px]'>Time: <span className='text-gray-400 font-bold'>{Time}</span></span>
              <span className='text-white font-bold text-[18px]'>Status: <span className='text-gray-400'>{status}</span></span>
            <div className = 'flex items-center mt-[5px]'>
                <div className='cursor-pointer' onClick={() => navigate('/interviewees/1')}>
                    {parseInt(interviewees) !== 0 ? <AvatarStack /> : ''}
                </div>
                <span className='text-white text-[14px] ml-[1.5%] font-bold'>{interviewees} Interviewees applied for an interview</span>
            </div>
            <div className = 'flex items-center justify-end mt-[15px] gap-5'>
                <button className = 'text-white bg-red-700 px-[3%] py-[1%] rounded-[20px] font-bold' onClick={deleteInterview}>Delete</button>
                <button className = 'text-white bg-orange-600 px-[3%] py-[1%] rounded-[20px] font-bold'>Update</button>
            </div>
        </div> 
    </div>
  )
}
export default Interview