import React, { useState, useEffect, createContext } from 'react';
import Header from '../../../src/components/Header/Header';
import InterviewCard from '../../pages/Interviewers/InterviewCard';
import { Spinner } from '@material-tailwind/react';
import { Button, IconButton } from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getFollowedInterviews, getUserInformation } from '../../services/auth/authSlice';
import axios from 'axios';

export const InterviewsContext = createContext(null);

const UserInterviews = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.Manager);
    const [interviews, setInterviews] = useState([]);
    const [isDeleted, setIsDeleted] = useState(false);
    const [totalPages, setTotalPages] = useState(null);
    const [userID, setUserID] = useState('');
    const [active, setActive] = useState(1);

    const fetchUserInfo = async () => {
        await dispatch(getUserInformation()).then((response) => {
            if (!response.error) {
                setUserID(response.payload.user.id);
            }
        });
    };

    const [FollowedInterviewsIDS, setFollowedInterviewsIDS] = useState([]);
    const fetchFollowedInterviews = async () => {
        await dispatch(getFollowedInterviews()).then((response) => {
            if (!response.error) {
                const newID = response.payload.interviews.map((interview) => interview.id);
                setFollowedInterviewsIDS(newID);
                localStorage.setItem('FollowedInterviewsIDS', JSON.stringify(newID));
            }
        });
    };

    const fetchAllInterviews = async (page) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/interview/get_all_interviews`, {
                params: { page },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setInterviews(response.data.interviews);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCompaniesInterviews = async (page) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/get_interviews_by_following_companies`, {
                params: { page },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data.totalPages)
            setInterviews(response.data.interviews);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    const [isAllClicked, setIsAllClicked] = useState(true);
    const [isCompaniesClicked, setIsCompaniesClicked] = useState(false);

    const handleAllClick = () => {
        setIsAllClicked(true);
        setIsCompaniesClicked(false);
    };

    const handleCompaniesClick = () => {
        setIsCompaniesClicked(true);
        setIsAllClicked(false);
    };

    useEffect(() => {
        fetchUserInfo();
        const storedFollowedInterviewsIDS = localStorage.getItem('FollowedInterviewsIDS');
        if (storedFollowedInterviewsIDS) {
            setFollowedInterviewsIDS(JSON.parse(storedFollowedInterviewsIDS));
        } else {
            fetchFollowedInterviews();
        }
        setInterviews(null);
        if (isAllClicked) fetchAllInterviews(active);
        if (isCompaniesClicked) fetchCompaniesInterviews(active);
    }, [active, isDeleted, isAllClicked, isCompaniesClicked]);

    const next = () => {
        setActive((prev) => Math.min(prev + 1, totalPages));
    };

    const prev = () => {
        setActive((prev) => Math.max(prev - 1, 1));
    };

    const getItemProps = (index) => ({
        variant: active === index ? "filled" : "text",
        color: "gray",
        onClick: () => setActive(index),
    });

    return (
        <div>
            <InterviewsContext.Provider value={{}}>
                <div className='w-full min-h-[80vh] overflow-x-hidden mt-[60px]'>
                    <Header />
                    {isLoading && (
                        <div className='fixed inset-0 flex items-center justify-center bg-opacity-50 z-50'>
                            <Spinner color="blue" size="5xl" className="h-12 w-12" />
                        </div>
                    )}
                    <div className='flex flex-row space-x-4 ms-3'>
                        <button
                            onClick={handleAllClick}
                            className={`mt-[18px] text-[15px] font-bold outline-none border-none py-[8px] px-[20px] rounded-[20px] transition-all ease-in-out duration-300 
                ${isAllClicked ? 'text-white bg-green-600 hover:bg-green-500' : 'text-gray-600 bg-gray-400 hover:bg-gray-300'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={handleCompaniesClick}
                            className={`mt-[18px] text-[15px] font-bold outline-none border-none py-[8px] px-[20px] rounded-[20px] transition-all ease-in-out duration-300 
                ${isCompaniesClicked ? 'text-white bg-green-600 hover:bg-green-500' : 'text-gray-600 bg-gray-400 hover:bg-gray-300'}`}
                        >
                            Companies Interviews
                        </button>
                    </div>
                    {!isLoading && interviews ? (
                        <div className='flex items-center justify-center flex-wrap w-full min-h-[100px] px-[5%] py-[2%] gap-x-[2%] gap-y-6 '>
                            {interviews.map((interview) => (
                                <InterviewCard
                                    key={interview.id}
                                    id={interview.id}
                                    image={interview.image}
                                    title={interview.job_title}
                                    description={interview.job_description}
                                    Date={interview.Date}
                                    Time={interview.Time}
                                    company_name={interview.company_name}
                                    status={interview.status}
                                    UsersAttending={interview.interviewees_ids}
                                    UserID={userID}
                                    questions={interview.questions}
                                    attended_interviewees_ids={interview.attended_interviewees_ids}
                                />
                            ))}
                        </div>
                    ) : null}
                    {totalPages && totalPages !== 0 ? (
                        <div className={`flex items-center justify-center gap-4 abosolute mb-[50px] overflow-x-hidden ${!interviews ? 'mt-[80vh]' : ''} ${isLoading && interviews ? 'mt-[80vh]' : ''}`}>
                            <Button
                                variant="text"
                                className="flex items-center gap-2 text-white font-bold border-[1px] border-borderColor text-[14px] "
                                onClick={prev}
                                disabled={active === 1}
                            > Previous
                            </Button>
                            <div className="flex items-center gap-2 flex-wrap">
                                {[...Array(totalPages)].map((_, index) => (
                                    <IconButton
                                        key={index}
                                        className={`text-white bg-transparent border-[1px] border-borderColor text-[16px] font-bold ${active === index + 1 ? "bg-green-700" : ""}`}
                                        {...getItemProps(index + 1)}
                                    >
                                        {index + 1}
                                    </IconButton>
                                ))}
                            </div>
                            <Button
                                variant="text"
                                className="flex items-center gap-2 text-white font-bold border-[1px] border-borderColor text-[14px]"
                                onClick={next}
                                disabled={active === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    ) : (
                        <div className='flex justify-center items-center'>
                            {totalPages === 0 ? (
                                <div className='flex flex-col'>
                                    <h1 className='text-3xl text-gray-400 font-bold'>No interviews available</h1>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </InterviewsContext.Provider>
        </div>
    );
};

export default UserInterviews;
