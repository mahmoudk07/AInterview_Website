import React, { useState } from 'react'
import { useDispatch , useSelector } from 'react-redux';
import { SignupUser } from '../../../services/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../components/Modal/Modal';
import './Signup.css'
const Signup = () => {
    const [data, setData] = useState({
        firstname: "", lastname: "" , email: "" , password: "" , gender: "", job: "Software Engineer", role: "user"
    })
    const [focusedInputs, setFocusedInputs] = useState({
        name : true , email: true , password: true
    })
    const [showModal, setShowModal] = useState(false)
    const { error } = useSelector((state) => state.User)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        if (data.firstname !== "" && data.email !== "" && data.password !== "" && data.job !== "" && data.role !== "")
            dispatch(SignupUser(data)).then((response) => {
                if (!response.hasOwnProperty('error'))
                    navigate('/login')
                else
                    openModal()
            })
    }
    const openModal = () => { 
        setShowModal(true)
    }
    const closeModal = () => { 
        setShowModal(false)
    }
    const jobTitles = [
        'Data Scientist',
        'Product Manager',
        'UX Designer',
        'Marketing Manager',
        'Accountant',
        'HR Specialist',
        'Sales Representative',
        'Customer Service Representative',
        'Operations Manager',
    ];
    return (
    <div className = 'flex items-center justify-center w-[100vw] h-[100vh]'>
        <Modal show = { showModal } message = { error } close = { closeModal } />
        <form className = 'login__form min-w-[25%] min-h-[80%] bg-transparent py-[30px] px-[40px]' onSubmit = {handleSubmit}>
              <h1 className='text-3xl font-bold text-white text-center mb-[35px]'>Signup</h1>
                <div className={`relative ${data.firstname === "" && !focusedInputs.name ? 'mb-[30px]' : ''}`}>
                    <input className={` block bg-transparent w-full p-[10px] text-white rounded-[20px] outline-none border-[2px] border-solid border-gray-500 ${data.firstname === "" && !focusedInputs.name ? 'mb-[0px]' :'mb-[35px]'} pr-[40px]`}
                      type='text' id='name' placeholder='Name' required onChange = {(e) => setData({...data , firstname: e.target.value.split(' ')[0], lastname: e.target.value.split(' ')[1]})}
                      onFocus = {() => setFocusedInputs({...focusedInputs , name: true})}
                      onBlur = {() => setFocusedInputs({...focusedInputs , name: false})}
                  />
                    <i className='absolute right-[15px] top-[18%] text-[20px] bx bxs-user'></i>
                    {data.firstname === "" && !focusedInputs.name && <span className = 'font-bold text-[16px] text-red-600 ml-1'>Name is required</span>}
                </div>
                <div className={`relative ${data.email === "" && !focusedInputs.email ? 'mb-[30px]' : ''}`}>
                    <input className={`block bg-transparent w-full p-[10px] text-white rounded-[20px] outline-none border-[2px] border-solid border-gray-500 ${data.email === "" && !focusedInputs.email ? 'mb-[0px]' : 'mb-[35px]'} pr-[40px]`}
                        type='email' id='email' placeholder='Email' required onChange = {(e) => setData({...data , email: e.target.value})}
                        onFocus={() => setFocusedInputs({ ...focusedInputs, email: true })}
                        onBlur={() => setFocusedInputs({ ...focusedInputs, email: false })}
                    />
                    <i className='absolute right-[15px] top-[18%] text-[20px] bx bxs-envelope'></i>
                    {data.email === "" && !focusedInputs.email && <span className='font-bold text-[16px] text-red-600 ml-1'>Email is required</span>}
                </div>
                <div className={`relative ${data.password === "" && !focusedInputs.password ? 'mb-[30px]' : ''}`}>
                    <input className={`block bg-transparent w-full p-[10px] text-white rounded-[20px] outline-none border-[2px] border-solid border-gray-500 ${data.password === "" && !focusedInputs.password ? 'mb-[0px]' : 'mb-[35px]'} pr-[40px]`}
                        type='password' id='password' placeholder='Password' required onChange={(e) => setData({ ...data, password: e.target.value })}
                        onFocus={() => setFocusedInputs({ ...focusedInputs, password: true })}
                        onBlur={() => setFocusedInputs({ ...focusedInputs, password: false })}
                  />
                    <i className = 'absolute right-[15px] top-[17px] text-[20px] bx bxs-lock-alt'></i>
                    {data.password === "" && !focusedInputs.password && <span className='font-bold text-[16px] text-red-600 ml-1'>Password is required</span>}
                </div>
                <div className="flex items-center justify-between gender-selector mb-[20px]">
                    <div className = 'flex items-center'>
                        <label className='text-gray-300 mr-[20px] font-bold'>
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                className='mr-[5px] cursor-pointer'
                                id='male'
                                onChange = {(e) => setData({...data , gender: e.target.value})}
                            />
                            Male
                        </label>
                        <label className='text-gray-300 font-bold'>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                className='mr-[5px] cursor-pointer'
                                id='female'
                                onChange = {(e) => setData({...data , gender : e.target.value})}
                            />
                            Female
                        </label>
                    </div>
                    <select className= 'bg-transparent rounded-[10px] outline-none border-[2px] border-solid border-gray-500 text-gray-300 appearance-none font-bold px-[8px] py-[7px] cursor-pointer' id='role' onChange = {(e) => setData({...data , role : e.target.value.toLowerCase()})}>
                        <option value = 'user'>User</option>
                        <option value = 'admin'>Admin</option>
                        <option value = 'manager'>Manager</option>
                    </select>
                </div>
                <div className="job__title__selector mb-[25px]">
                    <label className = 'text-gray-300 font-bold block' htmlFor="job-title">Select a job title:</label>
                    <select className= 'mt-[5px] p-[10px] rounded-[10px] font-bold appearance-none bg-transparent border-[2px] border-solid border-gray-500 text-gray-300 outline-none cursor-pointer' id = "job-title" onChange = {(e) => setData({...data , job : e.target.value})}>
                        <option value = "Software Engineer">Software Engineer</option>
                        {jobTitles.map((title) => (
                            <option key={title} value={title}>
                                {title}
                            </option>
                        ))}
                    </select>
                </div>
              <button type = 'submit' className='w-full rounded-[30px] py-[10px] bg-green-600 text-white font-bold mb-[10px]'>Submit</button>
        </form>
    </div>
  )
}

export default Signup