import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LoginUser } from '../../../services/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { validateEmail } from '../../../utils/Utilities'
import Modal from '../../../components/Modal/Modal'
import './Login.css'
const Login = () => {
    const [isValidEmail, setIsValidEmail] = useState(true)
    const [focusedInputs, setFocusedInputs] = useState({
        email: true , password: true
    })
    const [showModal, setShowModal] = useState(false)
    const { error } = useSelector((state) => state.User)
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (data.email !== "" && data.password !== "" && isValidEmail)
            dispatch(LoginUser(data)).then((response) => {
                if (!response.hasOwnProperty('error'))
                    navigate('/')
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
    useEffect(() => {
        localStorage.removeItem('token')
    }, [])
  return (
    <div className = 'flex items-center justify-center w-[100vw] h-[100vh]'>
        <Modal show={showModal} message = {error} close = {closeModal} />
        <form className = 'login__form min-w-[25%] min-h-[55%] bg-transparent py-[30px] px-[40px]' onSubmit = {handleSubmit}>
              <h1 className='text-3xl font-bold text-white text-center mb-[35px]'>Login</h1>
              <div className = {`relative ${data.email === "" && !focusedInputs.email ? 'mb-[35px]' : ''}`}>
                  <input className={`block bg-transparent w-full p-[10px] text-white rounded-[20px] outline-none border-[2px] border-solid border-gray-500 ${data.email === "" && !focusedInputs.email ? 'mb-[0px]' : 'mb-[35px]'} pr-[40px]`}
                      type='email' id='email' placeholder='Email' required onChange={(e) => { setData({ ...data, email: e.target.value }); setIsValidEmail(validateEmail(e.target.value)) }}
                      onFocus={() => setFocusedInputs({ ...focusedInputs, email: true })}
                      onBlur={() => setFocusedInputs({ ...focusedInputs, email: false })}
                  />
                  <i className='absolute right-[15px] top-[20%] text-[20px] bx bxs-user'></i>
                  {data.email === "" && !focusedInputs.email && <span className='text-[16px] font-bold text-red-600 ml-1'>Email is required</span>}
              </div>
              <div className={`relative ${data.password === "" && !focusedInputs.password ? 'mb-[25px]' : ''}`}>
                  <input className={`block bg-transparent w-full p-[10px] text-white rounded-[20px] outline-none border-[2px] border-solid border-gray-500 ${data.password === "" && !focusedInputs.password ? 'mb-[0px]' : 'mb-[25px]'} pr-[40px]`}
                      type='password' id='password' placeholder='Password' required onChange={(e) => setData({ ...data, password: e.target.value })}
                      onFocus={() => setFocusedInputs({ ...focusedInputs, password: true })}
                      onBlur={() => setFocusedInputs({ ...focusedInputs, password: false })}
                  />
                  <i className='absolute right-[15px] top-[17px] text-[20px] bx bxs-lock-alt'></i>
                  {data.password === "" && !focusedInputs.password && <span className='text-[16px] font-bold text-red-600 ml-1'>Password is required</span>}
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