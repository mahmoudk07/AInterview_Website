import React, { useContext, useEffect } from 'react'
import { Input } from '@material-tailwind/react'
import { UpdateInterviewContext } from '../../UpdateInterview'
const UpdateScheduling = () => {
    const { data, setData, numOfQuestions, setNumOfQuestions, setIsInputChanged } = useContext(UpdateInterviewContext)
    useEffect(() => {
        const num = parseInt(numOfQuestions);
        if (num > 0 && Number.isInteger(num)) {
            setData(prevData => {
                const currentQuestions = prevData.questions || [];
                const currentLength = currentQuestions.length;
                let newQuestions;
                if (num > currentLength) {
                    // Retain existing questions and add new empty questions
                    const additionalQuestions = Array.from({ length: num - currentLength }, (_, index) => ({
                        [`Q${currentLength + index + 1}`]: "",
                        "Type": "",
                        "Answer": ""
                    }));
                    newQuestions = [...currentQuestions, ...additionalQuestions];
                } else {
                    // Retain only the necessary questions
                    newQuestions = currentQuestions.slice(0, num);
                }

                return { ...prevData, questions: newQuestions };
            });
        }
    }, [numOfQuestions, setData, setNumOfQuestions]);
    return (  
        <div className='mt-[60px]'>
            {data ? 
                <div className='flex-col items-center space-y-5'>
                    <Input type="text" label="Job title" variant='outlined' color='white' defaultValue={data?.job_title} onChange={(e) => { setIsInputChanged(true); setData({ ...data, job_title: e.target.value }) }} />
                    <Input type="text" label="Job description" variant='outlined' color='white' defaultValue={data?.job_description} onChange={(e) => { setIsInputChanged(true); setData({ ...data, job_description: e.target.value }) }} />
                    <Input type="text" label="Job opportunity" variant='outlined' color='white' defaultValue={data?.job_opportunity} onChange={(e) => { setIsInputChanged(true); setData({ ...data, job_opportunity: e.target.value }) }} />
                    <Input type="text" label="Number of Questions" variant='outlined' color='white' defaultValue={numOfQuestions} onChange={(e) => { setIsInputChanged(true); setNumOfQuestions(e.target.value) }} />
                    <input className='date-picker text-white bg-transparent outline-none w-full border-[1px] border-white px-[2%] py-[1.5%] rounded-[10px] cursor-pointer' type="date" defaultValue={data?.Date} onChange={(e) => { setIsInputChanged(true); setData({ ...data, Date: e.target.value }) }} />
                    <input type="time" className='date-picker text-white bg-transparent outline-none w-full border-[1px] border-white px-[2%] py-[1.5%] rounded-[10px] cursor-pointer' defaultValue={data?.Time} onChange={(e) => { setIsInputChanged(true); setData({ ...data, Time: e.target.value }) }} />
                </div> : ''}
        </div>
  )
}
export default UpdateScheduling