import React, { useContext , useEffect } from 'react'
import { Input } from '@material-tailwind/react'
import { InterviewContext } from '../../CreateInterview'
const InterviewScheduling = () => {
  const { data, setData } = useContext(InterviewContext)
  useEffect(() => {
    const num = parseInt(data.numOfQuestions);
    if (num > 0 && Number.isInteger(num)) {
      const newQuestions = Array.from({ length: num }, (_, index) => ({
        [`Q${index + 1}`]: "",
        "Answer": ""
      }));
      setData(prevData => ({ ...prevData, Questions: newQuestions }));
    }
  }, [data.numOfQuestions]);
  return (
    <div className = 'mt-[60px]'>
        <div className = 'flex-col items-center space-y-5'>
            <Input type = "text" label = "Title" variant = 'outlined' color = 'white' onChange = {(e) => setData({...data , title: e.target.value})} value = {data.title}  />
            <Input type = "text" label = "Date" variant = 'outlined' color = 'white' onChange = {(e) => setData({...data , Date: e.target.value})} value = {data.Date}  />
            <Input type = "text" label = "Time" variant = 'outlined' color = 'white' onChange = {(e) => setData({...data , Time: e.target.value})} value = {data.Time} />
            <Input type = "text" label = "Number of Questions" variant = 'outlined' color = 'white' onChange = {(e) => setData({...data , numOfQuestions: e.target.value})} value = {data.numOfQuestions} />
        </div>
    </div>
  )
}
export default InterviewScheduling