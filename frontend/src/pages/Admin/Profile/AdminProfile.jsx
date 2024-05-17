import React, {useState , useEffect} from 'react'
import Header from '../../../components/Header/Header'
import { Avatar, Input } from '@material-tailwind/react'
import { getAdminInformation } from '../../../services/admin/adminSlice'
import { useDispatch } from 'react-redux'
import Modal from '../../../components/Modal/Modal'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const AdminProfile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [isInputsChanged, setIsInputChanged] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const handleUpdate = async () => {
        await axios.patch(`${process.env.REACT_APP_BASE_URL}/admin/updateAdmin`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => { console.log(response); setShowModal(true) }).catch((error) => { console.log(error) })
    }
    const fetchingInformation = async () => {
        await dispatch(getAdminInformation()).then((response) => {
            if (!response.error) {
                setData(response.payload.user)
            }
        })
    }
    const closeModal = () => {
        setShowModal(false)
        navigate('/')
    }
    useEffect(() => {
        fetchingInformation()
        // eslint-disable-next-line
    } , [])
  return (
    <div className = 'w-full min-h-[80vh] flex justify-center items-center overflow-x-hidden mt-[80px] p-[4%] '>
          <Header />
          <Modal show={showModal} close={closeModal} message="Admin's Information updated successfully" />
          <div className='bg-transparent border-borderColor border-[1px] min-h-[400px] w-[100%] lg:w-[60%] p-[3%] rounded-[10px] mb-[70px] lg:mb-[0px]'>
              <div className='flex-col items-center justify-end text-center mb-[10px]'>
                  <Avatar className='rounded-[50%] w-[80px] h-[80px] m-auto' src={data?.image} alt="avatar" />
              </div>
              <span className='block text-2xl font-bold text-gray-300 mb-[20px]'>General Information</span>
              <div className='flex flex-col md:flex-row items-center justify-center md:space-x-[5%] mb-[25px] gap-y-6 md:gap-y-0'>
                  <Input type='text' variant="outlined" label="Firstname" color='white' defaultValue={data?.firstname.toUpperCase()} onChange={(e) => { setData({ ...data, firstname: e.target.value }); setIsInputChanged(true) }} />
                  <Input type='email' variant="outlined" label="Lastname" color='white' defaultValue={data?.lastname.toUpperCase()} onChange={(e) => { setData({ ...data, lastname: e.target.value }); setIsInputChanged(true) }} />
              </div>
              <div className='flex flex-col md:flex-row items-center justify-center md:space-x-[5%] mb-[25px] gap-y-6 md:gap-y-0'>
                  <Input type="text" variant="outlined" label="Email" color='white' defaultValue={data?.email} onChange={(e) => { setData({ ...data, email: e.target.value }); setIsInputChanged(true) }} />
                  <Input variant="outlined" label="Job" color='white' defaultValue={data?.job} onChange={(e) => { setData({ ...data, job: e.target.value }); setIsInputChanged(true) }} />
              </div>
              <div className='flex justify-end mt-[10%]'>
                  <button className='text-white font-bold rounded-[20px] py-[10px] px-[15px] bg-red-800' onClick={handleUpdate} disabled={!isInputsChanged}>Update Profile</button>
              </div>
          </div>
    </div>
  )
}

export default AdminProfile