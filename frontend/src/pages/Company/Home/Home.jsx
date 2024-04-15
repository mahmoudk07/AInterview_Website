import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header/Header'
import AI_Image from '../../../assets/2401770.jpg'
import { useNavigate } from 'react-router-dom'
const Home = () => {
  const [isManager, setIsManager] = useState("")
  const [role , setRole] = useState("")
  const navigate = useNavigate()
  const Navigate = () => {
    navigate('/createInterview')
  }
  useEffect(() => {
    const role = localStorage.getItem('type')
    const isManager = localStorage.getItem('isManager')
    setRole(role)
    setIsManager(isManager)
    console.log(role , isManager)
  }, [])
  const handleRole = () => {
    if (role === "manager" && isManager !== "undefined")
      return <button className='interview-button' onClick={Navigate}>Create Interview</button>
    else if(role === "manager" && isManager === "undefined")
      return <button className='interview-button' onClick={Navigate}>Add your company</button>
    else
      return ""
  }
  return (
    <div className = 'w-full min-h-[100vh] overflow-x-hidden'>
      <Header />
      <div className='main-section'>
        <div className='text-center'>
          <span className='block text-3xl font-bold text-gray-200 mb-[15px]'>Seamless Interview Management Platform </span>
          <span className='block font-bold text-gray-200 text-2xl'>Make Your Interview Process Easy!</span>
          {/* <button className='interview-button' onClick={Navigate}>Create Interview</button> */}
          {handleRole()}
        </div>
        <div className = 'text-center'>
          <img src = {AI_Image} className = 'h-[500px]' alt = "AI" />
        </div>
      </div>
    </div>
  )
}

export default Home