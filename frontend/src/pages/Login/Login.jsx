import React from 'react'
import './Login.css'
const Login = () => {
  return (
    <div className = 'flex items-center justify-center w-[100vw] h-[100vh]'>
        <form className = 'login__form w-[25%] h-[55%] bg-transparent py-[30px] px-[40px]'>
              <h1 className='text-3xl font-bold text-white text-center mb-[35px]'>Login</h1>
              <div className = 'relative'>
                  <input className='bg-transparent w-full p-[10px] text-white rounded-[20px] outline-none border-[2px] border-solid border-gray-500 mb-[35px] pr-[40px]'
                      type='email' id='email' placeholder='Email' required
                  />
                  <i className='absolute right-[15px] top-[18%] text-[20px] bx bxs-user'></i>
              </div>
              <div className = 'relative'>
                  <input className='bg-transparent w-full p-[10px] text-white rounded-[20px] outline-none border-[2px] border-solid border-gray-500 mb-[25px] pr-[40px]'
                      type='password' id='password' placeholder='Password' required
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
              <button className='w-full rounded-[30px] py-[10px] text-white font-bold bg-green-600 mb-[10px]'>Submit</button>
              <div className = 'text-center'>
                  <span className='text-center text-[15px] text-white'>Don't have an account? <a className='font-bold' href='/signup'>Register</a></span>
              </div>
        </form>
    </div>
  )
}

export default Login