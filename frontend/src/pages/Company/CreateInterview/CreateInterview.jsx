import React , {useState} from 'react'
import Header from '../../../components/Header/Header'
import { Stepper, Step, Button, Typography } from '@material-tailwind/react'
import InterviewScheduling from './components/Scheduling/InterviewScheduling'
import QuestionsAnswers from './components/QuestionsAnswers/QuestionsAnswers'
import CompletedInterview from './components/CompletedInterview/CompletedInterview'
const CreateInterview = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [isLastStep, setIsLastStep] = useState(false);
    const [isFirstStep, setIsFirstStep] = useState(false);
    const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
    const CurrentContent = () => {
        switch (activeStep) {
            case 0:
                return <InterviewScheduling />
            case 1:
                return <QuestionsAnswers />
            case 3:
                return <CompletedInterview />
            default:
        }
    }
  return (
    <div className = 'w-full min-h-[80vh] overflow-x-hidden mt-[150px]'>
        <Header />
        <div className = 'bg-transparent border-borderColor border-[1px] rounded-[10px] w-[50%] m-auto p-[3%]'>
            <Stepper
                className = 'w-[100%]'            
                activeStep={activeStep}
                isLastStep={(value) => setIsLastStep(value)}
                isFirstStep={(value) => setIsFirstStep(value)} activeLineClassName='bg-green-500' lineClassName="bg-white/50">
                <Step onClick={() => setActiveStep(0)} activeClassName='bg-white' completedClassName='bg-green-500'>
                    <div className="absolute -bottom-[2rem] ml-2 w-max text-center">
                        <Typography variant="h6" className = 'text-gray-400'>
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
                <Step onClick={() => setActiveStep(2)} activeClassName='bg-white' completedClassName='bg-green-500'>
                    <div className="absolute -bottom-[2rem] ml-2 w-max text-center">
                        <Typography variant="h6" className = 'text-gray-400'>
                            Completed
                        </Typography>
                    </div>
                </Step>
            </Stepper>
            {CurrentContent()}
            { activeStep !== 3 &&
                <div className="mt-16 flex justify-between">
                      <Button className='bg-transparent font-bold text-white border-[1px] rounded-[20px] border-borderColor text-[13px]'
                        onClick={handlePrev} disabled={isFirstStep}>
                        Prev
                    </Button>
                    {
                        activeStep === 2 ? <Button className= 'bg-transparent font-bold text-white border-[1px] rounded-[20px] border-borderColor text-[13px]'
                            onClick={() => setActiveStep(3)}>Confirm</Button> :
                            <Button className= 'bg-transparent font-bold text-white border-[1px] rounded-[20px] border-borderColor text-[13px]'
                            onClick={handleNext} disabled={isLastStep}>
                            Next
                        </Button>
                    }
                </div>
            }
        </div>
    </div>
  )
}

export default CreateInterview