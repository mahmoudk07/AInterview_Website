import React from 'react'
import Header from '../../components/Header/Header'
import AI_Image from '../../assets/2401770.jpg'
const Home = () => {
  return (
    <div className = 'w-full min-h-[100vh] overflow-x-hidden'>
      <Header />
      <div className='main-section'>
        <div className='text-center'>
          <span className='block text-3xl font-bold text-gray-200 mb-[15px]'>Seamless Interview Management Platform </span>
          <span className='block font-bold text-gray-200 text-2xl'>Make Your Interview Process Easy!</span>
          <button className = 'interview-button'>Create Interview</button>
        </div>
        <div className = 'text-center'>
          <img src = {AI_Image} className = 'h-[500px]' alt = "AI" />
        </div>
      </div>
    </div>
  )
}

export default Home