import React, {useState , useEffect} from 'react'
import InterviewCard from '../../pages/Interviewers/InterviewCard'
import Header from '../../components/Header/Header'
import CompanyCard from './CompanyCard'
import InformationUser from './InformationUser'
import googleImage from '../../assets/google.jpeg';
import facebookImage from '../../assets/facebook.jpeg';
import amazonImage from '../../assets/amazonjpeg.jpeg';
import microsoftImage from '../../assets/micropng.png';
import siemensImage from '../../assets/download.png'
import { useDispatch } from 'react-redux'
import { getUserInformation } from '../../services/auth/authSlice'
import { getFollowedCompanies } from '../../services/auth/authSlice'
import { getFollowedInterviews } from '../../services/auth/authSlice'
const interviewData = [
    {
        image: googleImage,
        jobTitle: "Google Interview",
        description: "The job is for a software engineer. The applicant must have at least a bachelor's degree in computer engineering."
    },
    {
        image: facebookImage,
        jobTitle: "Facebook Interview",
        description: "The job is for a software engineer. The applicant must have at least a bachelor's degree in computer engineering."
    },
    {
        image: amazonImage,
        jobTitle: "Amazon Interview",
        description: "The job is for a software engineer. The applicant must have at least a bachelor's degree in computer engineering."
    },
    {
        image: microsoftImage,
        jobTitle: "Microsoft Interview",
        description: "The job is for a software engineer. The applicant must have at least a bachelor's degree in computer engineering."
    },
    {
        image: googleImage,
        jobTitle: "Google Interview",
        description: "The job is for a software engineer. The applicant must have at least a bachelor's degree in computer engineering."
    },
    {
        image: siemensImage,
        jobTitle: "Siemens Interview",
        description: "The job is for a software engineer. The applicant must have at least a bachelor's degree in computer engineering."
    }
];

const companyData = [
    {
        comapanyImage: googleImage,
        companyname: "Google",
        address: "Mountain View, California"
    },
    {
        comapanyImage: facebookImage,
        companyname: "Facebook",
        address: "Menlo Park, California"
    },
    {
        comapanyImage: amazonImage,
        companyname: "Amazon",
        address: "Seattle, Washington"
    },
    {
        comapanyImage: microsoftImage,
        companyname: "Microsoft",
        address: "Redmond, Washington"
    },
    {
        comapanyImage: siemensImage,
        companyname: "Siemens",
        address: "Seattle, Washington"
    }
];
const UserProfile = () => {
    const dispatch = useDispatch()
    const [userInfo, setUserInfo] = useState(null)
    const [followed_companies, setFollowedCompanies] = useState(null)
    const [followed_interviews, setFollowedInterviews] = useState(null)
    const fetchUserInfo = async () => {
        await dispatch(getUserInformation()).then((response) => {
            if (!response.error) {
                setUserInfo(response.payload.user)
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
    } , [])
    return (
        <div className = 'w-full min-h-[80vh] mt-[100px] mb-[100px]'>
            <Header />
            <div className=' px-5 py-3 mt-[100px] border border-borderColor rounded-lg w-[80%] m-auto'>
                <InformationUser />
                <div>
                    <h1 className='text-white text-bold text-4xl mt-10 mb-10'>Interviews</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                        {interviewData.map((interview, index) => (
                            <InterviewCard
                                key={index}
                                image={interview.image}
                                jobTitle={interview.jobTitle}
                                description={interview.description}
                            />
                        ))}
                    </div>

                </div>
                <h1 className='text-white text-bold text-4xl mt-10 mb-10'>Pages you follow</h1>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-[20px]">
                {companyData.map((company, index) => (
                        <CompanyCard
                            key={index}
                            comapanyImage={company.comapanyImage}
                            companyname={company.companyname}
                            address={company.address}
                        />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default UserProfile
