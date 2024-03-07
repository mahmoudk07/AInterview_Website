import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { LoginUser } from '../../services/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/Utilities'
import './Login.css'
const Login = () => {
    const [isValidEmail , setIsValidEmail] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const data = {
        email, password
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if(email !== "" && password !== "" && isValidEmail)
            await dispatch(LoginUser(data)).then(() => navigate('/'))
    }
    useEffect(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('firstname')
        localStorage.removeItem('lastname')
    }, [])
  return (
    <div className = 'flex items-center justify-center w-[100vw] h-[100vh]'>
        <form className = 'login__form min-w-[25%] min-h-[55%] bg-transparent py-[30px] px-[40px]' onSubmit = {handleSubmit}>
              <h1 className='text-3xl font-bold text-white text-center mb-[35px]'>Login</h1>
              <div className = 'relative'>
                  <input className='bg-transparent w-full p-[10px] text-white rounded-[20px] outline-none border-[2px] border-solid border-gray-500 mb-[35px] pr-[40px]'
                      type='email' id='email' placeholder='Email' required onChange={(e) => { setEmail(e.target.value); setIsValidEmail(validateEmail(e.target.value)) }}
                  />
                  <i className='absolute right-[15px] top-[18%] text-[20px] bx bxs-user'></i>
              </div>
              <div className = 'relative'>
                  <input className='bg-transparent w-full p-[10px] text-white rounded-[20px] outline-none border-[2px] border-solid border-gray-500 mb-[25px] pr-[40px]'
                      type='password' id='password' placeholder='Password' required onChange = {(e) => setPassword(e.target.value)}
                  />
                  <i className = 'absolute right-[15px] top-[17px] text-[20px] bx bxs-lock-alt'></i>
              </div>
              <div className='flex items-center justify-between mb-[15px]'>
                  <div className = 'remember__me__checkbox'>
                        <input className = 'mr-[5px]' type='checkbox' id='remember' />
                        <label className='text-white' htmlFor='remember'>Remember me</label>
                  </div>
                  <a className = 'decoration-0 text-white' href = '/forgotPassword'>Forgot password?</a>
              </div>
              <button type = 'submit' className='w-full rounded-[30px] py-[10px] text-white font-bold bg-green-600 mb-[10px]'>Submit</button>
              <div className = 'text-center'>
                  <span className='text-center text-[15px] text-white'>Don't have an account? <a className='font-bold' href='/signup'>Register</a></span>
              </div>
        </form>
    </div>
  )
}

export default Login