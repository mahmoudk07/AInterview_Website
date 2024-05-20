import React from 'react';
// import googleImage from '../../assets/google.jpeg';
import defaultImage from '../../assets/unknown.png';


const InterviewCard = ({
    image,
    description,
    Date,
    Time,
    company_name,
    title,
    status,
    favouriteornot,
    renderfolloworunfollow,
}) => {
    return (
        // لو قربت هنا يا محمود هعلقك
        <div className=" bg-white flex flex-col items-center border-[1px] border-borderColor border-bac bg-opacity-35 backdrop-filter backdrop-blur-lg rounded-lg p-6 max-w-sm shadow-lg w-60 transform transition-all duration-500 hover:scale-105 cursor-pointer">
            <div className="flex flex-col items-center">
                <img className="w-16 h-16 rounded-full border-4 border-white" src={image || defaultImage} alt="company_image" />
                <h1 className="text-tertiary-color text-2xl font-bold text-center mt-2 mb-2">{company_name}</h1>
            </div>
            <div className="flex flex-col space-y-1 mt-2 items-center">
                <p className="text-lg font-bold text-gray-100 text-center">
                    {title}
                </p>
                <p className="text-sm text-gray-400 text-center">
                    {description}
                </p>
                <p className="text-sm text-gray-400 text-center">
                    {Date}
                </p>
                <p className="text-sm text-gray-400 text-center">
                    {Time}
                </p>
                <p className="text-md uppercase text-green-400 font-sans text-center">
                    {status}
                </p>
                
            </div>
            {/* <div className="flex flex-row space-x-3 mt-5">
                <FaFacebook className="text-gray-300" />
                <FaTwitter className="text-gray-300" />
                <FaLinkedin className="text-gray-300" />
            </div> */}
            
            <div className='mt-3'>
                <button className={`mt-[18px] text-[15px] font-bold text-white bg-green-600 outline-none border-none py-[8px] px-[20px] rounded-[20px] transition-all ease-in-out duration-300 hover:bg-green-500 ${status !== "current" ? "hidden" : ""}`}>
                    Apply
                </button>
            </div>
            <div className=''>
                <button className={`mt-[18px] text-[15px] font-bold text-white bg-green-600 outline-none border-none py-[8px] px-[20px] rounded-[20px] transition-all ease-in-out duration-300 hover:bg-green-500 ${favouriteornot ? "hidden" : ""}`}>
                     Add to Favourites
                </button>
            </div>
        </div>
    );
};

export default InterviewCard;
