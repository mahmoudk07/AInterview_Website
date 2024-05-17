import React, { useContext } from 'react'
import { Input } from '@material-tailwind/react'
import { InterviewContext } from '../../CreateInterview'
const QuestionsAnswers = () => {
    const { data, setData } = useContext(InterviewContext)
    const addQuestion = (e , index) => {
        const newQuestions = [...data.questions]
        newQuestions[index][`Q${index + 1}`] = e.target.value
        setData({...data , questions: newQuestions})
    }
    const addAnswer = (e, index) => {
        const newAnswer = [...data.questions]
        newAnswer[index]['Answer'] = e.target.value
        setData({...data , questions: newAnswer})
    }
    const addType = (e, index) => {
        const newType = [...data.questions]
        newType[index]['Type'] = e.target.value
        setData({...data , questions: newType})
    }
  return (
    <div className = 'mt-[60px]'>
        {
            data.questions.map((question, index) => (
                <div key = {index} className='flex-col space-y-2 mb-[20px] bg-transparent p-[3%] border-[2px] border-gray-600 rounded-[10px]'>
                    <Input type="text" label={`Question ${index + 1}`} variant='outlined' color='white' onChange={(e) => addQuestion(e, index)} />
                    <Input type="text" label="Type" variant='outlined' color='white' onChange = {(e) => addType(e , index)} />
                    <Input type="text" label="Answer" variant='outlined' color='white' onChange={(e) => addAnswer(e, index)} />
                </div>
            ))
        }
    </div>
  )
}
export default QuestionsAnswers