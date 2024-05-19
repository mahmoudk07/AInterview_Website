import React from 'react'
import googleImage from '../../assets/megz.jpg';
const Information_User = () => {
    return (
        <div className= 'flex flex-col mt-2'>
            <div className='flex items-center justify-center'>
                <img className="w-20 h-20 rounded-full border-4 border-white" src={googleImage} alt="Google" />
            </div>
            <div className='mt-5 flex flex-start'>
                <h1 className='text-white text-bold text-3xl'>General Information</h1>
            </div>

        </div>
    )
}

export default Information_User
