import React, { useState, useEffect, createContext } from 'react'
import Header from '../../../components/Header/Header'
import Interview from './Components/Interview'
import axios from "axios"
import Modal from '../../../components/Modal/Modal'
export const InterviewsContext = createContext(null)
const Interviews = () => {
  const [data, setData] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const closeModal = () => {
    setShowModal(false)
  }
  const fetchInterviews = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/interview/get_interviews`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then((response) => setData(response.data.interviews)).catch((error) => console.log(error))
  }
  useEffect(() => {
    fetchInterviews();
  }, [data])
  return (
    <InterviewsContext.Provider value={{ setShowModal }}>
      <Modal show={showModal} close={closeModal} message = "Interview deleted successfully" />
      <div className='w-full min-h-[80vh] overflow-x-hidden mt-[100px]'>
        <Header />
        {data ?
          <div className='flex items-center flex-wrap w-full min-h-[100px] px-[5%] py-[2%] gap-x-[2%] gap-y-6'>
            {data.map((interview) => <Interview key={interview.id} id={interview.id} title={interview.title} Date={interview.Date} Time={interview.Time} status={interview.status} interviewees={interview.interviewees} />)}
          </div> : ''}
      </div>
    </InterviewsContext.Provider>
  )
}

export default Interviews