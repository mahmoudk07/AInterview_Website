import React, { useState, useEffect, createContext } from 'react'
import { Stepper, Step, Button, Typography } from '@material-tailwind/react'
import Header from '../../../components/Header/Header'
import UpdateQuestions from './components/UpdateQuestions/UpdateQuestions'
import UpdateScheduling from './components/UpdateScheduling/UpdateScheduling'
import UpdateCompletion from './components/UpdateCompletion/UpdateCompletion'
import { useParams } from 'react-router-dom'
import axios from 'axios'
export const UpdateInterviewContext = createContext(null)
const UpdateInterview = () => {
    const { id } = useParams()
    const [numOfQuestions, setNumOfQuestions] = useState("")
    const [data, setData] = useState(null)
    const [activeStep, setActiveStep] = useState(0);
    const [isLastStep, setIsLastStep] = useState(false);
    const [isFirstStep, setIsFirstStep] = useState(false);
    const [isInputChanged , setIsInputChanged] = useState(false)
    const checkCurrentData = () => data?.Date !== "" && data?.Time !== "" && numOfQuestions !== "" && data?.title !== ""
    const hasEmptyValues = data?.questions.some(question => Object.values(question).some(value => value === ""));
    const handleNext = () => checkCurrentData() &&!isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
    const CurrentContent = () => {
        switch (activeStep) {
            case 0:
                return <UpdateScheduling />
            case 1:
                return <UpdateQuestions />
            case 2:
                return <UpdateCompletion />
            default:
        }
    }
    const fetchingInterview = async () => {
        await axios.get(`${process.env.REACT_APP_BASE_URL}/interview/get_interview/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => {setNumOfQuestions(response.data.interview.questions.length); setData(response.data.interview); console.log(response) }).catch((error) => console.log(error))
    }
    const handleSubmit = async () => {
        await axios.patch(`${process.env.REACT_APP_BASE_URL}/interview/update_interview/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => { setActiveStep(2); console.log(response) }).catch((error) => console.log(error))
    }
    useEffect(() => {
        fetchingInterview();
    }, [])
  return (
    <div className = 'w-full min-h-[80vh] overflow-x-hidden mt-[150px] mb-[50px]'>
        <Header />
          <UpdateInterviewContext.Provider value={{ data, setData, numOfQuestions, setNumOfQuestions, setIsInputChanged }}>
              {data ?
                  <div className='bg-transparent border-borderColor border-[1px] rounded-[10px] w-[40%] m-auto p-[3%]'>
                      <Stepper
                          className='w-[100%]'
                          activeStep={activeStep}
                          isLastStep={(value) => setIsLastStep(value)}
                          isFirstStep={(value) => setIsFirstStep(value)} activeLineClassName='bg-green-500' lineClassName="bg-white/50">
                          <Step onClick={() => setActiveStep(0)} activeClassName='bg-white' completedClassName='bg-green-500'>
                              <div className="absolute -bottom-[2rem] ml-2 w-max text-center">
                                  <Typography variant="h6" className='text-gray-400'>
                                      Scheduiling
                                  </Typography>
                              </div>
                          </Step>
                          <Step onClick={() => setActiveStep(1)} activeClassName='bg-white' completedClassName='bg-green-500'>
                              <div className="absolute -bottom-[2rem] ml-2 w-max text-center">
                                  <Typography variant="h6" className='text-gray-400'>
                                      Q/A
                                  </Typography>
                              </div>
                          </Step>
                          <Step onClick={() => setActiveStep(2)} activeClassName='bg-green-500'>
                              <div className="absolute -bottom-[2rem] ml-2 w-max text-center">
                                  <Typography variant="h6" className='text-gray-400'>
                                      Completed
                                  </Typography>
                              </div>
                          </Step>
                      </Stepper>
                      {CurrentContent()}
                      {activeStep !== 2 &&
                          <div className="mt-16 flex justify-between">
                              <Button className='bg-transparent font-bold text-white border-[1px] rounded-[20px] border-borderColor text-[13px]'
                                  onClick={handlePrev} disabled={isFirstStep}>
                                  Prev
                              </Button>
                              {
                                  activeStep === 1 ? <Button className='bg-transparent font-bold text-white border-[1px] rounded-[20px] border-borderColor text-[13px]'
                                      onClick={handleSubmit} disabled={hasEmptyValues || !isInputChanged}>Update</Button> :
                                      <Button className='bg-transparent font-bold text-white border-[1px] rounded-[20px] border-borderColor text-[13px]'
                                          onClick={handleNext} disabled={isLastStep}>
                                          Next
                                      </Button>
                              }
                          </div>
                      }
                  </div> : ''}
        </UpdateInterviewContext.Provider>
    </div>
  )
}

export default UpdateInterview