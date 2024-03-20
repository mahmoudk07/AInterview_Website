import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const CompletedInterview = () => {
    const navigate = useNavigate()
    useEffect(() => {
        setTimeout(() => navigate("/") , 2500)
    }, [navigate])
  return (
    <div className = 'mt-[60px]'>
          <div className='flex-col text-center'>
              <div className = 'flex justify-center items-center'>
                  <svg fill="none" height="100" viewBox="0 0 24 24" width="100" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" fill="#21c179" r="10" /><path clip-rule="evenodd" d="m16.6766 8.58327c.1936.19698.1908.51355-.0062.70708l-5.7054 5.60545c-.1914.1881-.4972.1915-.6927.0078l-2.67382-2.5115c-.20128-.189-.21118-.5055-.02212-.7067.18906-.2013.50548-.2112.70676-.0222l2.32368 2.1827 5.3628-5.26888c.1969-.19353.5135-.19073.707.00625z" fill="#fff" fill-rule="evenodd" /></svg>
              </div>
              <span className = 'font-bold text-success block text-[18px]'>CONGRATULATIONS!</span>
              <span className = 'font-bold text-gray-400 text-[18px]'>Your Interview has been created successfully</span>
        </div>
    </div>
  )
}

export default CompletedInterview