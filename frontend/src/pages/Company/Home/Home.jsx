import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header/Header'
import AI_Image from '../../../assets/2401770.jpg'
import { useNavigate } from 'react-router-dom'
import Service1 from "../../../assets/service-1.png"
import check from "../../../assets/check.svg"
import loading from "../../../assets/loading.png"
// import axios from 'axios'
const Home = () => {
  const [isManager, setIsManager] = useState("")
  const [role , setRole] = useState("")
  const navigate = useNavigate()
  const interviewCreation = () => {
    navigate('/createInterview')
  }
  const companyCreation = () => { 
    navigate('/addCompany')
  }
  const brainwaveServices = [
    "Interview Creation",
    "Performance Evaluation",
    "AI-Driven Feedback",
  ];
  // const fetchCompanies = async () => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/company/get_companies`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`
  //       }
  //     })
  //     setCompanies(response.data)
  //     console.log(response.data)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  // const fetchInterviews = async () => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/interview/get_all_interviews`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`
  //       }
  //     })
  //     setInterviews(response.data)
  //     console.log(response.data)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  useEffect(() => {
    const role = localStorage.getItem('type')
    const isManager = localStorage.getItem('isManager')
    setRole(role)
    setIsManager(isManager)
    if (role === "user") {
      // fetchCompanies()
      // fetchInterviews()
    }
    console.log(role , isManager)
  }, [])
  const handleRole = () => {
    if (role === "manager" && isManager !== "None")
      return (
        <div className=' justify-center flex flex-row space-x-3'>
            <button className='interview-button' onClick={interviewCreation}>Create Interview</button>
            <button className='green-button' onClick={() => navigate('/ReadyTemp')}>View ready Templates</button>
        </div>
      )
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
      <div className = 'text-center mb-[50px]'>
        <span className='text-white font-bold text-3xl'>Transforming Recruitment with AI</span>
      </div>
      <div className = 'w-full px-[10%]'>
        <div className="relative z-1 flex items-center h-[39rem] mb-5 p-8 border border-[#FFFFFF1A] rounded-3xl overflow-hidden lg:p-20 xl:h-[46rem]">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none md:w-3/5 xl:w-auto">
            <img
              className="w-full h-full object-cover md:object-right"
              width={800}
              alt="Smartest AI"
              height={730}
              src={Service1}
            />
          </div>
          <div className="relative z-1 max-w-[17rem] ml-auto">
            <span className="text-white text-[25px] mt-[10px]">AI Interview Platform</span>
            <p className="body-2 mt-[10px] mb-[3rem] text-n-3 text-[#ADA8C3]">
              Empowering Seamless and Efficient Interview Processes
            </p>
            <ul className="body-2">
              {brainwaveServices.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start py-4 border-t border-n-6 border-[#252180] text-white"
                >
                  <img width={24} height={24} src={check} alt = "Service" />
                  <p className="ml-4">{item}</p>
                </li>
              ))}
            </ul>
          </div>
          <div
            className={`flex items-center h-[3.5rem] px-6 bg-n-8/80 rounded-[1.7rem] text-base absolute left-4 right-4 bottom-4 border-n-1/10 border lg:left-1/2 lg-right-auto lg:bottom-8 lg:-translate-x-1/2`}
          >
            <img className="w-5 h-5 mr-4" src={loading} alt="Loading" />
            <span className='text-white'>Evaluating Candidate Performance...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Home