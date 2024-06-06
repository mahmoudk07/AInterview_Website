import React, { useContext, useState } from 'react'
import { Input } from '@material-tailwind/react'
import { InterviewContext } from '../../CreateInterview'
const QuestionsAnswers = () => {
    const { data, setData } = useContext(InterviewContext)
    const [questionType , setQuestionType] = useState("MCQ")
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
        if (e.target.value === 'MCQ' || e.target.value === 'TF') { delete data.questions[index]['hint_keywords']; console.log("here") }
        else
            data.questions[index]['hint_keywords'] = ""
        console.log(data.questions)
        const newType = [...data.questions]
        newType[index]['Type'] = e.target.value
        setData({...data , questions: newType})
    }
    const addKeywords = (e, index) => {
        const newKeywords = [...data.questions]
        newKeywords[index]['hint_keywords'] = e.target.value
        setData({...data , questions: newKeywords})
    }
    const addChoices = (e, index) => {
        const newChoices = [...data.questions]
        newChoices[index]['choices'] = e.target.value
        setData({...data , questions: newChoices})
    }
  return (
    <div className = 'mt-[60px]'>
        {
            data.questions.map((question, index) => (
                <div key = {index} className='flex-col space-y-2 mb-[20px] bg-transparent p-[3%] border-[2px] border-gray-600 rounded-[10px]'>
                    <Input type="text" label={`Question ${index + 1}`} variant='outlined' color='white' onChange={(e) => addQuestion(e, index)} />
                    {/* <Input type="text" label="Type" variant='outlined' color='white' onChange={(e) => addType(e, index)} /> */}
                    <select className = 'bg-transparent text-white border-[1px] border-[white] rounded-[5px] px-[10px] py-[10px] w-full text-[14px] appearance-none outline-none' onChange={(e) => { setQuestionType(e.target.value); addType(e, index); console.log(e.target.value) }}>
                        <option value="MCQ">MCQ</option>
                        <option value="TF">TF</option>
                        <option value="Technical">Technical</option>
                    </select>
                    <Input type="text" label="Answer" variant='outlined' color='white' onChange={(e) => addAnswer(e, index)} />
                    {(questionType === 'MCQ' || questionType === 'TF') && <Input type="text" label="Choices" variant='outlined' color='white' onChange={(e) => addChoices(e, index)} />}
                    <Input type="text" label="Keywords" variant='outlined' color='white' onChange={(e) => addKeywords(e, index)} />
                </div>
            ))
        }
    </div>
  )
}
export default QuestionsAnswers