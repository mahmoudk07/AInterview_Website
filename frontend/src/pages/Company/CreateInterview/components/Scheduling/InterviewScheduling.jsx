import React, { useContext , useEffect } from 'react'
import { Input } from '@material-tailwind/react'
import { InterviewContext } from '../../CreateInterview'
import "./InterviewScheduling.css"
const InterviewScheduling = () => {
  const { data, setData, numOfQuestions, setNumOfQuestions } = useContext(InterviewContext)
  useEffect(() => {
    const num = parseInt(numOfQuestions);
    if (num > 0 && Number.isInteger(num)) {
      const newQuestions = Array.from({ length: num }, (_, index) => ({
        [`Q${index + 1}`]: "",
        "Type": "",
        "Answer": ""
      }));
      setData(prevData => ({ ...prevData, questions: newQuestions }));
    }
  }, [setData, numOfQuestions , setNumOfQuestions]);
  return (
    <div className = 'mt-[60px]'>
        <div className = 'flex-col items-center space-y-5'>
            <Input type = "text" label = "Title" variant = 'outlined' color = 'white' onChange = {(e) => setData({...data , title: e.target.value})} value = {data.title}  />
            <Input type="text" label="Number of Questions" variant='outlined' color='white' onChange={(e) => setNumOfQuestions(e.target.value)} value={numOfQuestions} />
            <input className = 'date-picker text-white bg-transparent outline-none w-full border-[1px] border-white px-[2%] py-[1.5%] rounded-[10px] cursor-pointer' type = "date" onChange = {(e) => setData({...data , Date: e.target.value})} value = {data.Date}  />
            <input type="time" className='date-picker text-white bg-transparent outline-none w-full border-[1px] border-white px-[2%] py-[1.5%] rounded-[10px] cursor-pointer' onChange={(e) => setData({ ...data, Time: e.target.value })} value={data.Time} />
            {/* <Input type = "text" label = "Time" variant = 'outlined' color = 'white' onChange = {(e) => setData({...data , Time: e.target.value})} value = {data.Time} /> */}
        </div>
    </div>
  )
}
export default InterviewScheduling