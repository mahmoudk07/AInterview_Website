import React from 'react'
import InterviewCard from '../../pages/Interviewers/Interview_card'
import Header from '../../components/Header/Header'
import Company_Card from './Company_Card'
import Information_User from './Information_User'
import googleImage from '../../assets/google.jpeg';
import facebookImage from '../../assets/facebook.jpeg';
import amazonImage from '../../assets/amazonjpeg.jpeg';
import microsoftImage from '../../assets/micropng.png';
import siemensImage from '../../assets/download.png'
const UserProfile = () => {
    return (
        <div>
            <Header />
            <div className=' px-5 py-3 mt-[100px] border border-borderColor rounded-lg w-[80%] m-auto'>
                <Information_User />
                <div>
                    <h1 className='text-white text-bold text-4xl mt-10 mb-10'>Interviews</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                        <InterviewCard
                            image={googleImage}
                            jobTitle="Google Interview"
                            description="The job is for a software engineer. The applicant must have at least a bachelor's degree in computer engineering."
                        />
                        <InterviewCard
                            image={facebookImage}
                            jobTitle="Facebook Interview"
                            description="The job is for a software engineer. The applicant must have at least a bachelor's degree in computer engineering."
                        />
                        <InterviewCard
                            image={amazonImage}
                            jobTitle="Amazon Interview"
                            description="The job is for a software engineer. The applicant must have at least a bachelor's degree in computer engineering."
                        />
                        <InterviewCard
                            image={microsoftImage}
                            jobTitle="Microsoft Interview"
                            description="The job is for a software engineer. The applicant must have at least a bachelor's degree in computer engineering."
                        />
                        <InterviewCard
                            image={googleImage}
                            jobTitle="Google Interview"
                            description="The job is for a software engineer. The applicant must have at least a bachelor's degree in computer engineering."
                        />
                        <InterviewCard
                            image={siemensImage}
                            jobTitle="Siemens Interview"
                            description="The job is for a software engineer. The applicant must have at least a bachelor's degree in computer engineering."
                        />
                    </div>

                </div>
                <h1 className='text-white text-bold text-4xl mt-10 mb-10'>Pages you follow</h1>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <Company_Card comapanyImage={googleImage} companyname="Google" address="Mountain View, California" />
                    <Company_Card comapanyImage= {facebookImage} companyname="Facebook" address="Menlo Park, California" />
                    <Company_Card comapanyImage={amazonImage} companyname="Amazon" address="Seattle, Washington" />
                    <Company_Card comapanyImage={microsoftImage} companyname="Microsoft" address="Redmond, Washington" />
                    <Company_Card comapanyImage={siemensImage} companyname="Siemens" address = "Seattle,Washington"/>
                </div>
            </div>

        </div>
    )
}

export default UserProfile
