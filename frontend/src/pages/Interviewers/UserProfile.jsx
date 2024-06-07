import React, { useState, useEffect, createContext,useContext } from 'react'
import InterviewCard from '../../pages/Interviewers/InterviewCard'
import Header from '../../components/Header/Header'
import CompanyCard from './CompanyCard'
import InformationUser from './InformationUser'
import { useDispatch } from 'react-redux'
import { getUserInformation } from '../../services/auth/authSlice'
import { getFollowedCompanies } from '../../services/auth/authSlice'
import { getFollowedInterviews } from '../../services/auth/authSlice'
const UserProfile = () => {
    const dispatch = useDispatch()
    //const { setUserID } = useContext(GlobalContext);
    const [userID, setUserID] = useState('')
    const [userInfo, setUserInfo] = useState([])
    const [followed_companies, setFollowedCompanies] = useState([])
    const [followed_interviews, setFollowedInterviews] = useState([])

    const fetchUserInfo = async () => {
        await dispatch(getUserInformation()).then((response) => {
            if (!response.error) {
                setUserInfo(response.payload.user)
                setUserID(response.payload.user.id)
                console.log(response.payload.user)
            }
        })
    }

    const fetchFollowedCompanies = async () => {
        await dispatch(getFollowedCompanies()).then((response) => {
            if (!response.error) {
                setFollowedCompanies(response.payload.companies)
                console.log(response.payload.companies)
            }
        })
    }
    const fetchFollowedInterviews = async () => {
        await dispatch(getFollowedInterviews()).then((response) => {
            if (!response.error) {
                setFollowedInterviews(response.payload.interviews)
                console.log(response.payload.interviews)
            }
        })
    }
    useEffect(() => {
        fetchUserInfo()
        fetchFollowedCompanies()
        fetchFollowedInterviews()
        // eslint-disable-next-line
    }, [])
    return (
        <div className='w-full min-h-[80vh] mt-[100px] mb-[100px]'>
            <Header />
            <div className=' px-5 py-3 mt-[100px] border border-borderColor rounded-lg w-[80%] m-auto'>
                <InformationUser info={userInfo} />
                <div>
                    <h1 className='text-white text-bold text-3xl mt-10 mb-10'> Favourite Interviews</h1>
                    <div className='flex flex-row flex-wrap gap-x-[2%] gap-y-6 '>
                        {followed_interviews.map((interview, index) => (
                            <InterviewCard
                                key={index}
                                id={interview.id}
                                image={interview.image}
                                title={interview.job_title}
                                description={interview.job_description}
                                Date={interview.Date}
                                Time={interview.Time}
                                company_name={interview.company_name}
                                status={interview.status}
                                UserID={userID}
                                UsersAttending = {interview.interviewees_ids}
                                questions = {interview.questions}
                                attended_interviewees_ids = {interview.attended_interviewees_ids}
                            />
                        ))}
                    </div>

                </div>
                <h1 className='text-white text-bold text-4xl mt-10 mb-10'>Pages you follow</h1>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-[20px]">
                    {followed_companies.map((company, index) => (
                        <CompanyCard
                            key={index}
                            id={company.id}
                            comapanyImage={company.image}
                            companyname={company.name}
                            address={company.address}
                            website={company.website}
                        />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default UserProfile
