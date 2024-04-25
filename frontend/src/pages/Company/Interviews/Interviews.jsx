import React, { useState, useEffect, createContext } from 'react'
import Header from '../../../components/Header/Header'
import Interview from './Components/Interview'
import { Spinner } from '@material-tailwind/react'
import Modal from '../../../components/Modal/Modal'
import { Button, IconButton } from '@material-tailwind/react'
import { useDispatch } from 'react-redux'
import { fetchInterviews } from '../../../services/manager/managerSlice'
import { useSelector } from 'react-redux'
export const InterviewsContext = createContext(null)
const Interviews = () => {
  const { isLoading } = useSelector((state) => state.Manager)
  const dispacth = useDispatch()
  const [data, setData] = useState(null)
  const [isDeleted, setIsDeleted] = useState(false)
  const [totalPages, setTotalPages] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const closeModal = () => {
    setShowModal(false)
    setIsDeleted(!isDeleted)
  }
  const [active, setActive] = React.useState(1);
  const getItemProps = (index) =>
  ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => setActive(index),
  });
  const next = () => {
    setActive(active + 1);
    setData(null)
  };
  const prev = () => {
    setActive(active - 1);
    setData(null)
  };
  const fetching = async () => {
    await dispacth(fetchInterviews(active)).then((response) => {
      if (!response.error) {
        setData(response.payload.interviews)
        setTotalPages(response.payload.totalPages)
      }
    })
  }
  useEffect(() => {
    fetching();
    // eslint-disable-next-line
  }, [active, isDeleted])
  return (
    <InterviewsContext.Provider value={{ setShowModal }}>
      <div className='w-full min-h-[80vh] overflow-x-hidden mt-[100px]'>
        <Header />
        <Modal show={showModal} close={closeModal} message="Interview deleted successfully" />
        {isLoading ? <div className='fixed inset-0 flex items-center justify-center bg-opacity-50 z-50'>
          <Spinner color="blue" size="5xl" className="h-12 w-12" />
        </div> : ''}
        {!isLoading && data ?
          <div className='flex items-center flex-wrap w-full min-h-[100px] px-[5%] py-[2%] gap-x-[2%] gap-y-6'>
            {data.map((interview) => <Interview key={interview.id} id={interview.id} title={interview.title} Date={interview.Date} Time={interview.Time} status={interview.status} interviewees={interview.interviewees} />)}
          </div> : ''}
        {totalPages && totalPages !== 0 ?
          <div className={`flex items-center gap-4 ml-[26%] mb-[50px] overflow-x-hidden ${!data ? 'mt-[80vh]' : ''} ${isLoading && data ? 'mt-[80vh]' : ''}`}>
            <Button
              variant="text"
              className="flex items-center gap-2 text-white font-bold border-[1px] border-borderColor text-[14px] "
              onClick={prev}
              disabled={active === 1}
            > Previous
            </Button>
            <div className="flex items-center gap-2 flex-wrap">
              {[...Array(totalPages)].map((_, index) => (
                <IconButton
                  key={index}
                  className={`text-white bg-transparent border-[1px] border-borderColor text-[16px] font-bold ${active === index + 1 ? "bg-green-700" : ""}`}
                  {...getItemProps(index + 1)}
                >
                  {index + 1}
                </IconButton>
              ))}
            </div>
            <Button
              variant="text"
              className="flex items-center gap-2 text-white font-bold border-[1px] border-borderColor text-[14px]"
              onClick={next}
              disabled={active === totalPages}
            >
              Next
            </Button>
          </div> : ''}
      </div>

    </InterviewsContext.Provider>
  )
}

export default Interviews