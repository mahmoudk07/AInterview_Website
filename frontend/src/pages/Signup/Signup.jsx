import React from 'react'
import './Signup.css'
const Signup = () => {
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
        <form className = 'login__form w-[25%] h-[85%] bg-transparent py-[30px] px-[40px]'>
              <h1 className='text-3xl font-bold text-white text-center mb-[35px]'>Signup</h1>
              <div className = 'relative'>
                  <input className='bg-transparent w-full p-[10px] text-white rounded-[20px] outline-none border-[2px] border-solid border-gray-500 mb-[35px] pr-[40px]'
                      type='text' id='email' placeholder='Name' required
                  />
                  <i className='absolute right-[15px] top-[18%] text-[20px] bx bxs-user'></i>
                </div>
                <div className='relative'>
                    <input className='bg-transparent w-full p-[10px] text-white rounded-[20px] outline-none border-[2px] border-solid border-gray-500 mb-[35px] pr-[40px]'
                        type='email' id='email' placeholder='Email' required
                    />
                    <i className='absolute right-[15px] top-[18%] text-[20px] bx bxs-envelope'></i>
                </div>
              <div className = 'relative'>
                  <input className='bg-transparent w-full p-[10px] text-white rounded-[20px] outline-none border-[2px] border-solid border-gray-500 mb-[35px] pr-[40px]'
                      type='password' id='password' placeholder='Password' required
                  />
                  <i className = 'absolute right-[15px] top-[17px] text-[20px] bx bxs-lock-alt'></i>
                </div>
                <div className='relative'>
                    <input className='bg-transparent w-full p-[10px] text-white rounded-[20px] outline-none border-[2px] border-solid border-gray-500 mb-[25px] pr-[40px]'
                        type='password' id='password' placeholder='Confirm Password' required
                    />
                    <i className='absolute right-[15px] top-[17px] text-[20px] bx bxs-lock-alt'></i>
                </div>
                <div className="gender-selector mb-[20px]">
                    <label className = 'text-gray-300 mr-[20px] font-bold'>
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            className = 'mr-[5px]'
                        />
                        Male
                    </label>
                    <label className = 'text-gray-300 font-bold'>
                        <input
                            type="radio"
                            name="gender"
                            value="female"
                            className = 'mr-[5px]'
                        />
                        Female
                    </label>
                </div>
                <div className="job__title__selector mb-[25px]">
                    <label className = 'text-gray-300 font-bold' htmlFor="job-title">Select a job title:</label>
                    <select className= 'mt-[5px] p-[10px] rounded-[10px] font-bold appearance-none bg-transparent border-[2px] border-solid border-gray-500 text-gray-300 outline-none' id = "job-title">
                        <option value = "Software Engineer">Software Engineer</option>
                        {jobTitles.map((title) => (
                            <option key={title} value={title}>
                                {title}
                            </option>
                        ))}
                    </select>
                </div>
              <button className='w-full rounded-[30px] py-[10px] bg-green-600 text-white font-bold mb-[10px]'>Submit</button>
        </form>
    </div>
  )
}

export default Signup