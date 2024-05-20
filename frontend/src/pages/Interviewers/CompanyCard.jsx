import React from 'react'
import defaultImage from '../../assets/unknown.png';

const CompanyCard = ({ comapanyImage, companyname, address }) => {
    return (
        <div className='flex flex-row items-center justify-between hover:cursor-pointer '>
            <div className='flex flex-row space-x-3 items-center '>
                <div>
                    <img className="w-10 h-10 rounded-full border-4 border-white" src={comapanyImage || defaultImage} alt="Google" />
                </div>
                <div>
                    <h1 className='text-xl text-bold text-gray-300'>
                        {companyname}
                    </h1>
                    <p className=' text-xs text-gray-400'>
                        {address}
                    </p>
                </div>
            </div>
            <div>
                <button className='text-[15px] font-bold text-white bg-blue-500 outline-none border-none py-[10px] px-[15px] rounded-[20px] transition-all ease-in-out duration-300 hover:bg-blue-500'>Followed</button>
            </div>
        </div>
    )
}

export default CompanyCard
