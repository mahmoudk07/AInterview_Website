import React from 'react'
import { Input } from '@material-tailwind/react'
const InterviewScheduling = () => {
  return (
    <div className = 'mt-[60px]'>
        <div className = 'flex-col items-center space-y-5'>
            <Input type = "text" label = "Title" variant = 'outlined' color = 'white'  />
            <Input type = "text" label = "Date" variant = 'outlined' color = 'white'  />
            <Input type = "text" label = "Time" variant = 'outlined' color = 'white' />
            <Input type = "text" label = "Number of Questions" variant = 'outlined' color = 'white' />
        </div>
    </div>
  )
}
export default InterviewScheduling