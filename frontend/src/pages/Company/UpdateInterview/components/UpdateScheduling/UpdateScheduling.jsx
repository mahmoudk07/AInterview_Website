import React, { useContext } from 'react'
import { Input } from '@material-tailwind/react'
import { UpdateInterviewContext } from '../../UpdateInterview'
const UpdateScheduling = () => {
    const { data, setData, numOfQuestions, setNumOfQuestions, setIsInputChanged } = useContext(UpdateInterviewContext)
    return (  
        <div className='mt-[60px]'>
            {data ? 
                <div className='flex-col items-center space-y-5'>
                    <Input type="text" label="Title" variant='outlined' color='white' defaultValue={data?.title} onChange={(e) => { setIsInputChanged(true); setData({ ...data, title: e.target.value }) }} />
                    <Input type="text" label="Number of Questions" variant='outlined' color='white' defaultValue={numOfQuestions} onChange={(e) => { setIsInputChanged(true); setNumOfQuestions(e.target.value) }} />
                    <input className='date-picker text-white bg-transparent outline-none w-full border-[1px] border-white px-[2%] py-[1.5%] rounded-[10px] cursor-pointer' type="date" defaultValue={data?.Date} onChange={(e) => { setIsInputChanged(true); setData({ ...data, Date: e.target.value }) }} />
                    <input type="time" className='date-picker text-white bg-transparent outline-none w-full border-[1px] border-white px-[2%] py-[1.5%] rounded-[10px] cursor-pointer' defaultValue={data?.Time} onChange={(e) => { setIsInputChanged(true); setData({ ...data, Time: e.target.value }) }} />
                    {/* <Input type = "text" label = "Time" variant = 'outlined' color = 'white' onChange = {(e) => setData({...data , Time: e.target.value})} value = {data.Time} /> */}
                </div> : ''}
        </div>
  )
}
export default UpdateScheduling