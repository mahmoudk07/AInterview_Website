import React, { useState, useEffect } from 'react';
import defaultImage from '../../assets/unknown.png';
import axios from 'axios';

const CompanyCard = ({ comapanyImage, companyname, address , id }) => {
    const [isFollowed, setIsFollowed] = useState(false);

    useEffect(() => {
        const followedCompanies = JSON.parse(localStorage.getItem('FollowedCompaniesIDS')) || [];
        if (followedCompanies.includes(id)) {
            console.log(isFollowed)
            setIsFollowed(true);
        }
    }, [id,isFollowed]);

    const handleFollowToggle = async () => {
        const followedCompanies = JSON.parse(localStorage.getItem('FollowedCompaniesIDS')) || [];
        if (isFollowed) {
            const updatedCompanies = followedCompanies.filter(companyidId => companyidId !== id);
            localStorage.setItem('FollowedCompaniesIDS', JSON.stringify(updatedCompanies));
            await onUnfollow(); // Call the unfollow function
        } else {
            followedCompanies.push(id);
            localStorage.setItem('FollowedCompaniesIDS', JSON.stringify(followedCompanies));
            await onFollow(); // Call the follow function
        }
        setIsFollowed(!isFollowed);
    };
    const onFollow = async () => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/auth/follow/${id}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    const onUnfollow = async () => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/auth/unfollow/${id}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className='bg-white pt-4 pb-4 mx-5 w-52  h-64 rounded-lg flex flex-col border border-borderColor border-bac bg-opacity-35 backdrop-filter backdrop-blur-lg items-center justify-between transform transition-all duration-500 hover:scale-105 cursor-pointer '>
            <div className='flex flex-col space-y-3 items-center '>
                <div>
                    <img className="w-14 h-14 rounded-full border-4 border-white" src={comapanyImage || defaultImage} alt="image" />
                </div>
                <div className='flex flex-col items-center'>
                    <h1 className='text-2xl text-bold text-gray-300'>
                        {companyname}
                    </h1>
                    <p className=' text-s text-gray-400'>
                        {address}
                    </p>
                </div>
            </div>
            <div>
                <button onClick={handleFollowToggle} className={`text-[15px] font-bold text-white outline-none border-none py-[10px] px-[15px] rounded-[20px] transition-all ease-in-out duration-300  ${isFollowed ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}>{isFollowed ? 'Unfollow' : 'Follow'}</button>
            </div>
        </div>
    )
}

export default CompanyCard
