import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { SignupUser } from '../../services/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Error } from '../../services/auth/authSlice';
import './Signup.css'
const Signup = () => {
    const [name , setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [gender, setGender] = useState("")
    const [job, setJob] = useState("Software Engineer")
    const [role, setRole] = useState("User")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const data = {
        firstname: name.split(' ')[0], lastname: name.split(' ')[1],
        email, password, gender, job, role: role.toLowerCase()
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (name !== "" && email !== "" && password !== "" && job !== "" && role !== "")
        {
            dispatch(SignupUser(data))
            if(!Error)
                navigate('/login')
        }
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
        <form className = 'login__form min-w-[25%] h-[88%] bg-transparent py-[30px] px-[40px]' onSubmit = {handleSubmit}>
              <h1 className='text-3xl font-bold text-white text-center mb-[35px]'>Signup</h1>
              <div className = 'relative'>
                  <input className='bg-transparent w-full p-[10px] text-white rounded-[20px] outline-none border-[2px] border-solid border-gray-500 mb-[35px] pr-[40px]'
                      type='text' id='name' placeholder='Name' required onChange = {(e) => setName(e.target.value)}
                  />
                  <i className='absolute right-[15px] top-[18%] text-[20px] bx bxs-user'></i>
                </div>
                <div className='relative'>
                    <input className='bg-transparent w-full p-[10px] text-white rounded-[20px] outline-none border-[2px] border-solid border-gray-500 mb-[35px] pr-[40px]'
                        type='email' id='email' placeholder='Email' required onChange = {(e) => setEmail(e.target.value)}
                    />
                    <i className='absolute right-[15px] top-[18%] text-[20px] bx bxs-envelope'></i>
                </div>
              <div className = 'relative'>
                  <input className='bg-transparent w-full p-[10px] text-white rounded-[20px] outline-none border-[2px] border-solid border-gray-500 mb-[35px] pr-[40px]'
                      type='password' id='password' placeholder='Password' required onChange = {(e) => setPassword(e.target.value)}
                  />
                  <i className = 'absolute right-[15px] top-[17px] text-[20px] bx bxs-lock-alt'></i>
                </div>
                <div className="flex items-center justify-between gender-selector mb-[20px]">
                    <div className = 'flex items-center'>
                        <label className='text-gray-300 mr-[20px] font-bold'>
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                className='mr-[5px]'
                                id='male'
                                onChange = {(e) => setGender(e.target.value)}
                            />
                            Male
                        </label>
                        <label className='text-gray-300 font-bold'>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                className='mr-[5px]'
                                id='female'
                                onChange = {(e) => setGender(e.target.value)}
                            />
                            Female
                        </label>
                    </div>
                    <select className= 'bg-transparent rounded-[10px] outline-none border-[2px] border-solid border-gray-500 text-gray-300 appearance-none font-bold px-[8px] py-[7px] cursor-pointer' id='role' onChange = {(e) => setRole(e.target.value)}>
                        <option value = 'user'>User</option>
                        <option value = 'admin'>Admin</option>
                        <option value = 'manager'>Manager</option>
                    </select>
                </div>
                <div className="job__title__selector mb-[25px]">
                    <label className = 'text-gray-300 font-bold block' htmlFor="job-title">Select a job title:</label>
                    <select className= 'mt-[5px] p-[10px] rounded-[10px] font-bold appearance-none bg-transparent border-[2px] border-solid border-gray-500 text-gray-300 outline-none cursor-pointer' id = "job-title" onChange = {(e) => setJob(e.target.value)}>
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