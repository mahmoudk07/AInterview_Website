import React from 'react';
// import googleImage from '../../assets/google.jpeg';
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const InterviewCard = ({
    image,
    jobTitle,
    description,
}) => {
    return (
        <div className="flex flex-col items-center bg-transparent border-[1px] border-borderColor border-bac bg-opacity-35 backdrop-filter backdrop-blur-lg rounded-lg p-6 max-w-sm shadow-lg w-60 transform transition-all duration-500 hover:scale-105 cursor-pointer">
            <div className="flex flex-col items-center">
                <img className="w-16 h-16 rounded-full border-4 border-white" src={image} alt="Google" />
                <h1 className="text-tertiary-color text-2xl font-bold text-center mt-2 mb-2">{jobTitle}</h1>
            </div>
            <div className="flex flex-col space-y-1 mt-2 items-center">
                <p className="text-sm text-gray-400 text-center">
                    {description}
                </p>
            </div>
            <div className="flex flex-row space-x-3 mt-5">
                <FaFacebook className="text-gray-300" />
                <FaTwitter className="text-gray-300" />
                <FaLinkedin className="text-gray-300" />
            </div>
            <div className=''>
                <button className='mt-[18px] text-[15px] font-bold text-white bg-green-600 outline-none border-none py-[8px] px-[20px] rounded-[20px] transition-all ease-in-out duration-300 hover:bg-green-500'>Apply</button>
            </div>
        </div>
    );
};

export default InterviewCard;
