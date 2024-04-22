import React, { useState, useEffect } from 'react'
import Header from '../../../components/Header/Header'
import { Avatar, Input } from '@material-tailwind/react'
import axios from "axios"
import Modal from '../../../components/Modal/Modal'
import { useSelector, useDispatch } from 'react-redux'
import { fetchingCompanyInfo } from '../../../services/manager/managerSlice'
import { fetchingInterviewsStatus } from '../../../services/manager/managerSlice'
import { Spinner } from '@material-tailwind/react'
const Profile = () => {
    const { isLoading } = useSelector(state => state.Manager)
    const dispatch = useDispatch()
    const [isInputsChanged, setIsInputChanged] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const closeModal = () => {
        setShowModal(false)
    }
    const [CompanyData, setCompanyData] = useState(null)
    const [userData, setUserData] = useState(null)
    const [interviewsStatus, setInterviewsStatus] = useState(null)
    const handleUpdate = async () => {
        console.log(CompanyData)
        await axios.patch(`${process.env.REACT_APP_BASE_URL}/company/update`, CompanyData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => { console.log(response); setShowModal(true) }).catch((error) => { console.log(error) })
    }
    const handlingCompanyRequest = async () => {
        await dispatch(fetchingCompanyInfo()).then((response) => {
            if (!response.error) {
                setCompanyData(response.payload.company)
                setUserData(response.payload.user)
            }
        })
    }
    const handlingInterviewsRequest = async () => {
        await dispatch(fetchingInterviewsStatus()).then((response) => {
            if (!response.error)
                setInterviewsStatus(response.payload.results)
        })
    }
    useEffect(() => {
        handlingCompanyRequest();
        handlingInterviewsRequest();
        // eslint-disable-next-line
    }, [])
  return (
    <div className = 'w-full min-h-[80vh] overflow-x-hidden mt-[150px]'>
          <Header />
          <Modal show={showModal} close={closeModal} message="Company's Information updated successfully" />
          {isLoading ? <div className='fixed inset-0 flex items-center justify-center bg-opacity-50 z-50'>
              <Spinner color="blue" size="5xl" className="h-12 w-12" />
          </div> : ''}
          {CompanyData && userData && interviewsStatus ?
              <div className='md:flex flex-wrap items-center w-[80%] mx-[10%] space-x-[5%]'>
                  <div className='flex-col min-h-[400px] md:w-[24%] border-[1px] p-[0%] border-borderColor rounded-[10px] py-[2%] bg-transparent'>
                      <div className='flex-col items-center justify-end text-center mb-[10px]'>
                          <Avatar className='rounded-[50%] w-[80px] h-[80px] m-auto' src={userData?.image} alt="avatar" />
                          <span className='block font-bold text-white mt-[8px]'>{userData?.firstname.toUpperCase() + ' ' + userData.lastname.toUpperCase()}</span>
                          <span className='block text-[12px] text-gray-300 font-bold'>CEO of {CompanyData?.name}</span>
                      </div>
                      <hr className='border-borderColor outline-none b-[20px]' />
                      <div className='flex items-center justify-between p-[5%]'>
                          <span className='text-gray-300'>Finished Interviews</span>
                          <span className='text-red-700 font-bold'>{interviewsStatus.find(status => status._id === "finished")?.count || 0}</span>
                      </div>
                      <hr className='border-borderColor outline-none b-[20px]' />
                      <div className='flex items-center justify-between p-[5%]'>
                          <span className='text-gray-300'>Current Interviews</span>
                          <span className='text-green-700 font-bold'>{interviewsStatus.find(status => status._id === "upcoming")?.count || 0}</span>
                      </div>
                      <hr className='border-borderColor outline-none b-[20px]' />
                      <div className='flex items-center justify-between p-[5%]'>
                          <span className='text-gray-300'>Processed Interviews</span>
                          <span className='text-orange-500'>{interviewsStatus.find(status => status._id === "processed")?.count || 0}</span>
                      </div>
                      <hr className='border-borderColor outline-none b-[20px]' />
                      <div className='text-center'>
                          <button className='mt-[18px] text-[15px] font-bold text-white bg-green-600 outline-none border-none py-[10px] px-[15px] rounded-[20px] transition-all ease-in-out duration-300 hover:bg-green-500'>View Public Profile</button>
                      </div>
                  </div>
                  <div className='bg-transparent border-borderColor border-[1px] h-[400px] min-w-[70%] p-[3%] rounded-[10px]'>
                      <span className='block text-2xl font-bold text-gray-300 mb-[20px]'>General Information</span>
                      <div className='flex items-center justify-center space-x-[5%] mb-[25px]'>
                          <Input type='text' variant="outlined" label="Name" color='white' defaultValue={CompanyData?.name} onChange={(e) => { setCompanyData({ ...CompanyData, name: e.target.value }); setIsInputChanged(true) }} />
                          <Input type='email' variant="outlined" label="Email" color='white' defaultValue={CompanyData?.website} onChange={(e) => { setCompanyData({ ...CompanyData, website: e.target.value }); setIsInputChanged(true) }} />
                      </div>
                      <div className='flex items-center justify-center space-x-[5%] mb-[25px]'>
                          <Input type="text" variant="outlined" label="Address" color='white' defaultValue={CompanyData?.address} onChange={(e) => { setCompanyData({ ...CompanyData, address: e.target.value }); setIsInputChanged(true) }} />
                          <Input variant="outlined" label="Country" color='white' defaultValue={CompanyData?.country} onChange={(e) => { setCompanyData({ ...CompanyData, country: e.target.value }); setIsInputChanged(true)}} />
                      </div>
                      <div className='flex items-center justify-center space-x-[5%] mb-[25px]'>
                          <Input type="text" variant="outlined" label="Website" color='white' value="www.apple.com" onChange={(e) => { setIsInputChanged(true) }} />
                      </div>
                      <div className='flex justify-end mt-[10%]'>
                          <button className='text-white font-bold rounded-[20px] py-[10px] px-[15px] bg-red-800' onClick={handleUpdate} disabled={!isInputsChanged}>Update Profile</button>
                      </div>
                  </div>
              </div> : ''}
    </div>
  )
}
export default Profile