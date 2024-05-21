import React, { useContext , useEffect, useState } from 'react'
import { Input } from '@material-tailwind/react'
import { InterviewContext } from '../../CreateInterview'
import Modal from '../../../../../components/Modal/Modal'
import "./InterviewScheduling.css"
const InterviewScheduling = () => {
  const { data, setData, numOfQuestions, setNumOfQuestions } = useContext(InterviewContext)
  const [showModal, setShowModal] = useState(false)
  const [isInteger , setIsInteger] = useState(true)
  const closeModal = () => {
    setShowModal(false)
  }
  const handleDateChange = (e) => {
    const inputDate = new Date(e);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (inputDate > currentDate) {
      setData({ ...data, Date: e})
    }
    else {
      setData({ ...data, Date: "" })
      setShowModal(true)
    }
  };
  const checkIsNumber = (e) => {
    const num = parseInt(e)
    if (num > 0 && Number.isInteger(num)) {
      setNumOfQuestions(e)
      setIsInteger(true)
    }
    else {
      setNumOfQuestions("")
      if (e !== "") {
        setShowModal(true)
      }
      setIsInteger(false)
    }
  } 
  useEffect(() => {
    const num = parseInt(numOfQuestions);
    if (num > 0 && Number.isInteger(num)) {
      const newQuestions = Array.from({ length: num }, (_, index) => ({
        [`Q${index + 1}`]: "",
        "Type": "",
        "Answer": "",
        "hint_keywords": ""
      }));
      setData(prevData => ({ ...prevData, questions: newQuestions }));
    }
  }, [setData, numOfQuestions , setNumOfQuestions]);
  return (
    <div className='mt-[60px]'>
      <Modal show={showModal} close={closeModal} message={`${isInteger ? "Please enter a valid date" : "Please enter a valid number of questions" }`} />
        <div className = 'flex-col items-center space-y-5'>
            <Input type="text" label="Job title" variant='outlined' color='white' onChange={(e) => setData({ ...data, job_title: e.target.value })} value={data.job_title} />
            <Input type="text" label="Job Description" variant='outlined' color='white' onChange={(e) => setData({ ...data, job_description: e.target.value })} value={data.job_description} />
            <Input type="text" label="Job Opportunity" variant='outlined' color='white' onChange={(e) => setData({ ...data, job_opportunity: e.target.value })} value={data.job_opportunity} />
            <Input type="text" label="Number of Questions" variant='outlined' color='white' onChange={(e) => checkIsNumber(e.target.value)} value={numOfQuestions} />
            <input className='date-picker text-white bg-transparent outline-none w-full border-[1px] border-white px-[2%] py-[1.5%] rounded-[10px] cursor-pointer' type="date" onChange={(e) => handleDateChange(e.target.value) } value = {data.Date}  />
            <input type="time" className='date-picker text-white bg-transparent outline-none w-full border-[1px] border-white px-[2%] py-[1.5%] rounded-[10px] cursor-pointer' onChange={(e) => setData({ ...data, Time: e.target.value })} value={data.Time} />
        </div>
    </div>
  )
}
export default InterviewScheduling