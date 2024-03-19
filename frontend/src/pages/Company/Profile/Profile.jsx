import React, { useState } from 'react'
import Header from '../../../components/Header/Header'
import { Avatar , Input } from '@material-tailwind/react'
const Profile = () => {
    const [isInputsChanged , setIsInputChanged] = useState(false)
    const handleUpdate = (e) => {
        e.preventDefault()
    }
  return (
    <div className = 'w-full min-h-[80vh] overflow-x-hidden mt-[150px]'>
          <Header />
        <div className = 'md:flex flex-wrap items-center w-[80%] mx-[10%] space-x-[5%]'>
            <div className= 'flex-col min-h-[400px] md:w-[24%] border-[1px] p-[0%] border-borderColor rounded-[10px] py-[2%] bg-transparent'>
                <div className = 'flex-col items-center justify-end text-center mb-[10px]'>
                    <Avatar className='rounded-[50%] w-[80px] h-[80px] m-auto' src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar" />
                    <span className = 'block font-bold text-white mt-[8px]'>Tim Coke</span>
                    <span className = 'block text-[12px] text-gray-300 font-bold'>CEO of Apple</span>
                </div>
                <hr className = 'border-borderColor outline-none b-[20px]' />
                <div className = 'flex items-center justify-between p-[5%]'>
                    <span className = 'text-gray-300'>Processed Interviews</span>
                    <span className = 'text-red-700 font-bold'>32</span>
                </div>
                <hr className='border-borderColor outline-none b-[20px]' />
                <div className = 'flex items-center justify-between p-[5%]'>
                    <span className = 'text-gray-300'>Current Interviews</span>
                    <span className = 'text-green-700 font-bold'>32</span>
                </div>
                <hr className='border-borderColor outline-none b-[20px]' />
                <div className='flex items-center justify-between p-[5%]'>
                      <span className = 'text-gray-300'>Upcoming Interviews</span>
                      <span className = 'text-orange-500'>32</span>
                </div>
                <hr className='border-borderColor outline-none b-[20px]' />
                <div className = 'text-center'>
                    <button className = 'mt-[18px] text-[15px] font-bold text-white bg-green-600 outline-none border-none py-[10px] px-[15px] rounded-[20px] transition-all ease-in-out duration-300 hover:bg-green-500'>View Public Profile</button>
                </div>
            </div>
            <div className = 'bg-transparent border-borderColor border-[1px] h-[400px] min-w-[70%] p-[3%] rounded-[10px]'>
                <span className = 'block text-2xl font-bold text-gray-300 mb-[20px]'>General Information</span>
                <div className = 'flex items-center justify-center space-x-[5%] mb-[25px]'>           
                      <Input type = 'text' variant="outlined" label="Name" color='white' value = "Apple" onChange = {() => setIsInputChanged(true)}  />
                      <Input type = 'email' variant="outlined" label="Email" color='white' value = "apple@gmail.com" onChange = {() => setIsInputChanged(true)} />
                </div>
                <div className = 'flex items-center justify-center space-x-[5%] mb-[25px]'>           
                      <Input type = 'password' variant="outlined" label="Password" color='white' value = "apple" onChange = {() => setIsInputChanged(true)} />
                      <Input type = "text" variant="outlined" label="Address" color='white' value = "New york city" onChange = {() => setIsInputChanged(true)} />
                </div>
                <div className='flex items-center justify-center space-x-[5%] mb-[25px]'>
                    <Input variant="outlined" label="Country" color='white' onChange = {() => setIsInputChanged(true)} />
                    <Input type = "text" variant="outlined" label="Website" color='white' value = "www.apple.com" onChange = {() => setIsInputChanged(true)} />
                </div>
                <div className = 'flex justify-end mt-[10%]'>
                    <button className='text-white font-bold rounded-[20px] py-[10px] px-[15px] bg-red-800' onClick={handleUpdate} disabled={!isInputsChanged}>Update Profile</button>
                </div>
            </div>
        </div>
    </div>
  )
}
export default Profile