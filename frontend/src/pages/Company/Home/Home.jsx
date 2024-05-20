import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header/Header'
import AI_Image from '../../../assets/2401770.jpg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const Home = () => {
  const [companies, setCompanies] = useState(null)
  const [interviews, setInterviews] = useState(null)
  const [isManager, setIsManager] = useState("")
  const [role , setRole] = useState("")
  const navigate = useNavigate()
  const interviewCreation = () => {
    navigate('/createInterview')
  }
  const companyCreation = () => { 
    navigate('/addCompany')
  }
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/company/get_companies`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      setCompanies(response.data)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  const fetchInterviews = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/interview/get_all_interviews`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      setInterviews(response.data)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    const role = localStorage.getItem('type')
    const isManager = localStorage.getItem('isManager')
    setRole(role)
    setIsManager(isManager)
    if (role === "user") {
      fetchCompanies()
      fetchInterviews()
    }
    console.log(role , isManager)
  }, [])
  const handleRole = () => {
    if (role === "manager" && isManager !== "None")
      return <button className='interview-button' onClick={interviewCreation}>Create Interview</button>
    else if(role === "manager" && isManager === "None")
      return <button className='interview-button' onClick={companyCreation}>Add your company</button>
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