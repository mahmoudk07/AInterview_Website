import React, { useContext } from 'react'
import { UpdateInterviewContext } from '../../UpdateInterview'
import { Input } from '@material-tailwind/react'
const UpdateQuestions = () => {
  const { data, setData, setIsInputChanged } = useContext(UpdateInterviewContext)
  const addQuestion = (e, index) => {
    const newQuestions = [...data.questions]
    newQuestions[index][`Q${index + 1}`] = e.target.value
    setData({ ...data, questions: newQuestions })
  }
  const addAnswer = (e, index) => {
    const newAnswer = [...data.questions]
    newAnswer[index]['Answer'] = e.target.value
    setData({ ...data, questions: newAnswer })
  }
  const addType = (e, index) => {
    const newType = [...data.questions]
    newType[index]['Type'] = e.target.value
    setData({ ...data, questions: newType })
  }
  return (
    <div className='mt-[60px]'>
      {
        data?.questions.map((question, index) => (
          <div key={index} className='flex-col space-y-2 mb-[20px] bg-transparent p-[3%] border-[2px] border-gray-600 rounded-[10px]'>
            <Input type="text" label={`Question ${index + 1}`} variant='outlined' defaultValue={question[`Q${index + 1}`]} color='white' onChange={(e) => { setIsInputChanged(true); addQuestion(e, index) }} />
            <Input type="text" label="Type" variant='outlined' color='white' defaultValue={question.Type} onChange={(e) => { setIsInputChanged(true); addType(e, index) }} />
            <Input type="text" label="Answer" variant='outlined' color='white' defaultValue={question.Answer} onChange={(e) => { setIsInputChanged(true); addAnswer(e, index) }} />
          </div>
        ))
      }
    </div>
  )
}

export default UpdateQuestions