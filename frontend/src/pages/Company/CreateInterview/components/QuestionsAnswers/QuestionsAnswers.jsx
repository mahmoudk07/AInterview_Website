import React from 'react'
import { Input } from '@material-tailwind/react'
const QuestionsAnswers = () => {
    const data = [1 , 2 , 3 , 4 , 5]
  return (
    <div className = 'mt-[60px]'>
        {
            data.map((item, index) => (
                <div className='flex-col space-y-2 mb-[20px] bg-transparent p-[3%] border-[2px] border-gray-600 rounded-[10px]'>
                    <Input type="text" label={`Question ${index + 1}`} variant='outlined' color='white' />
                    <Input type="text" label="Answer" variant='outlined' color='white' />
                </div>
            ))
        }
    </div>
  )
}
export default QuestionsAnswers