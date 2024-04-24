import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { logout } from '../../services/auth/authSlice';
const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='header'>
      <div className = 'flex items-center space-x-2'>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><polygon fill="#AC6AFF" points="38.831 15.118 38.823 9.905 29.203 3.617 29.203 7.639 35.548 11.817 35.553 15.019 32.605 17.015 30.594 15.548 30.594 13.063 27.317 10.821 27.317 15.344 22.122 18.532 22.113 26.952 18.44 29.02 16.554 27.543 16.554 25.105 18.786 23.576 18.786 23.556 18.786 19.783 14.769 22.471 11.698 20.473 8.893 22.31 13.277 25.311 13.277 27.154 10.117 29.291 6.894 27.109 6.894 19.848 11.679 16.608 11.684 13.492 17.82 17.445 22.978 14.011 19.834 12.177 17.776 13.564 13.294 10.6 18.349 7.654 22.727 10.22 22.727 6.393 18.354 3.828 8.411 9.625 8.404 14.84 3.617 18.082 3.617 28.874 8.404 32.116 8.411 37.332 18.032 43.617 18.032 39.598 11.686 35.42 11.681 32.218 14.629 30.222 16.64 31.689 16.64 34.174 19.917 36.416 19.917 31.892 25.186 28.705 25.245 20.285 28.795 18.217 30.68 19.694 30.68 22.131 28.448 23.661 28.448 23.68 28.448 27.454 32.465 24.765 35.536 26.764 38.341 24.927 33.958 21.923 33.958 20.083 37.117 17.946 40.34 20.128 40.34 27.389 35.556 30.629 35.551 33.744 29.414 29.79 24.256 33.201 27.401 35.033 29.459 33.672 33.941 36.636 28.886 39.583 24.507 37.016 24.507 40.842 28.881 43.406 38.823 37.612 38.831 32.396 43.617 29.154 43.617 18.361" /></svg>
        <span className = 'text-white font-bold text-2xl'>AÏnterview</span>
      </div>
      <div className={`absolute flex md:flex-row flex-col justify-center items-start md:items-center md:space-x-10 md:relative top-[-100vh] md:top-[inherit] ${isOpen ? 'left-0 gap-5 p-[15px] w-full top-[68px] bg-black duration-500 text-black' : 'top-[-100vh]'} z-auto`}>
        {localStorage.getItem("token") !== null ? 
          <>
            <a href="/" className={`header-links ${isOpen ? 'w-full p-2 hover:bg-gray-400 transition-all ease-in-out duration-700' : ''}`} >Home</a>
            <a href="/profile" className={`header-links ${isOpen ? 'w-full p-2 hover:bg-gray-400 duration-700' : ''}`}>Profile</a>
            <a href="/interviews" className={`header-links ${isOpen ? 'w-full p-2 hover:bg-gray-400 duration-700' : ''}`}>Interviews</a>
            <a href="/followers" className={`header-links ${isOpen ? 'w-full p-2 hover:bg-gray-400 duration-700' : ''}`}>Followers</a>
          </> : ''}
      </div> 
      <div className = 'md:hidden flex ml-[30%] text-white text-2xl cursor-pointer' onClick = {() => setIsOpen(!isOpen)}>
        {isOpen ? <MdOutlineClose /> : <IoMenu />}
      </div>
      {localStorage.getItem("token") !== null ? <button className='header-buttons' onClick={() => { dispatch(logout()); navigate("/login") }}>Logout</button>
        : <button className={`header-buttons`} onClick={() => navigate("/login")}>Login</button>}
    </div>
  )
}

export default Header