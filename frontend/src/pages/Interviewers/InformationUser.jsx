import React from 'react'
import googleImage from '../../assets/megz.jpg';
import { Input } from '@material-tailwind/react';
const Information_User = () => {
    return (
        <div className= 'flex flex-col mt-2'>
            <div className='flex items-center justify-center'>
                <img className="w-20 h-20 rounded-full border-4 border-white" src={googleImage} alt="Google" />
            </div>
            <div className='mt-5 flex flex-start flex-col gap-5'>
                <h1 className='text-white text-bold text-3xl'>General Information</h1>
                <div className='flex flex-col md:flex-row items-center justify-center md:space-x-[5%]  gap-y-6 md:gap-y-0'>
                    <Input type='text' variant="outlined" label="Firstname" color='white' />
                    <Input type='email' variant="outlined" label="Lastname" color='white' />
                </div>
                <div className='flex flex-col md:flex-row items-center justify-center md:space-x-[5%] gap-y-6 md:gap-y-0'>
                    <Input type="text" variant="outlined" label="Email" color='white'/>
                    <Input variant="outlined" label="Job" color='white' />
                </div>
            </div>

        </div>
    )
}

export default Information_User
