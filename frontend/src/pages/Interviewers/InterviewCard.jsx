import React, { useState, useEffect } from 'react';
import defaultImage from '../../assets/unknown.png';
import axios from 'axios';
import { MdOutlineDateRange } from "react-icons/md";
import { CiTimer } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

const InterviewCard = ({
    id,
    image,
    description,
    Date,
    Time,
    company_name,
    title,
    status,
    UsersAttending,
    UserID,
    questions,
    attended_interviewees_ids
}) => {
    const [isApplied, setIsApplied] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);
    const [isAttending, setIsAttending] = useState(false);

    useEffect(() => {
        const followedInterviews = JSON.parse(localStorage.getItem('FollowedInterviewsIDS')) || [];
        if (followedInterviews.includes(id)) {
            setIsFollowed(true);
        }

        const appliedInterviews = JSON.parse(localStorage.getItem('AppliedInterviewsIDS')) || [];
        if (appliedInterviews.includes(id)) {
            setIsApplied(true);
        }
        if (attended_interviewees_ids.includes(UserID)) {
            setIsAttending(true);
        }
    }, [id,attended_interviewees_ids,UserID]);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/Quiz', { state: { userId: UserID, interviewId: id , questions: questions} });
    };

    const handleFollowToggle = async () => {
        const followedInterviews = JSON.parse(localStorage.getItem('FollowedInterviewsIDS')) || [];
        if (isFollowed) {
            const updatedInterviews = followedInterviews.filter(interviewId => interviewId !== id);
            localStorage.setItem('FollowedInterviewsIDS', JSON.stringify(updatedInterviews));
            await onUnfollow();
        } else {
            followedInterviews.push(id);
            localStorage.setItem('FollowedInterviewsIDS', JSON.stringify(followedInterviews));
            await onFollow();
        }
        setIsFollowed(!isFollowed);
    };

    const applyInterview = async () => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/auth/join_interview/${id}`, {}, {
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

    const handleApplyClick = async () => {
        setIsApplied(true);
        const appliedInterviews = JSON.parse(localStorage.getItem('AppliedInterviewsIDS')) || [];
        appliedInterviews.push(id);
        localStorage.setItem('AppliedInterviewsIDS', JSON.stringify(appliedInterviews));
        await applyInterview();
    };

    const onFollow = async () => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/auth/follow_interview/${id}`, {}, {
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
            const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/auth/unfollow_interview/${id}`, {}, {
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

    if (!UsersAttending) {
        UsersAttending = [];
    }

    const isUserAttending = UsersAttending.includes(UserID);

    return (
        <div className="bg-transparent flex flex-row space-x-6 border-[1px] border-borderColor border-bac bg-opacity-35 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg w-[30rem] transform transition-all duration-500 hover:scale-105 cursor-pointer hover:border-white">
            <div className="flex-shrink-0">
                <img className="w-16 h-16 rounded-full border-4 border-white" src={image || defaultImage} alt="company_image" />
            </div>
            <div className="flex flex-col justify-start items-start flex-wrap">
                <h1 className="text-tertiary-color text-2xl font-bold text-center mt-1 mb-1">{company_name}</h1>
                <p className="text-lg font-bold text-gray-100 ">{title}</p>
                <p className="text-sm text-gray-400">{description}</p>
                <div className="flex flex-row space-x-4">
                    <div className="flex flex-row space-x-2">
                        <MdOutlineDateRange className="text-gray-400" />
                        <p className="text-sm text-gray-400 text-center">{Date}</p>
                    </div>
                    <div className="flex flex-row space-x-2">
                        <CiTimer className="text-gray-400" />
                        <p className="text-sm text-gray-400 text-center">{Time}</p>
                    </div>
                </div>
                <p className="text-md uppercase text-green-400 font-sans text-center">{status}</p>
                <div className={`flex flex-row ${status !== "upcoming" ? 'gap-x-0' : 'gap-x-4'}`}>
                    <div>
                        <button
                            onClick={handleApplyClick}
                            disabled={isApplied}
                            className={`mt-[18px] text-[15px] font-bold text-white outline-none border-none py-[8px] px-[20px] rounded-[20px] transition-all ease-in-out duration-300 ${isApplied ? 'bg-gray-600 cursor-not-allowed ' : 'bg-green-600 hover:bg-green-500'} ${status !== "upcoming" ? "hidden" : ""}`}
                        >
                            {isApplied ? 'Applied' : 'Apply'}
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={handleFollowToggle}
                            className={`mt-[18px] text-[15px] font-bold text-white outline-none border-none py-[8px] px-[28px] rounded-[20px] transition-all ease-in-out duration-300 ${isFollowed ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}
                        >
                            {isFollowed ? 'Remove' : 'Add To Favourites'}
                        </button>
                    </div>
                </div>
                <div>
                    <button
                        onClick={handleClick}
                        disabled={isAttending}
                        className={`mt-[18px] text-[15px] font-bold text-white ${isAttending ? 'bg-gray-600 ' : 'bg-green-600 hover:bg-green-500'} outline-none border-none py-[8px] px-[20px] rounded-[20px] transition-all ease-in-out duration-300 ${status !== "current" || !isApplied ? "hidden" : ""}`}

                    >
                        {isAttending ? 'Interview attempted' : 'Start Interview'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewCard;
