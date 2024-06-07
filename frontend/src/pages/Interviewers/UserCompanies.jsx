import React, { useState, useEffect, createContext } from 'react'
import Header from '../../../src/components/Header/Header'
import CompanyCard from './CompanyCard'
import { Spinner } from '@material-tailwind/react'
import Modal from '../../../src/components/Modal/Modal'
import { Button, IconButton } from '@material-tailwind/react'
import { useDispatch } from 'react-redux'
import { getFollowedCompanies } from '../../../src/services/auth/authSlice'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import button from '@material-tailwind/react'
import axios from 'axios'
import { MdWork } from "react-icons/md";

export const InterviewsContext = createContext(null)
const UserCompanies = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoading } = useSelector((state) => state.Manager)
    const [Companies, setCompanies] = useState([])
    const [isDeleted, setIsDeleted] = useState(false)
    const [totalPages, setTotalPages] = useState(null)
    const [active, setActive] = React.useState(1);
    const getItemProps = (index) =>
    ({
        variant: active === index ? "filled" : "text",
        color: "gray",
        onClick: () => setActive(index),
    });
    const next = () => {
        setActive(active + 1);
        setCompanies(null)
    };
    const prev = () => {
        setActive(active - 1);
        setCompanies(null)
    };
    const [FollowedCompaniesIDS, setFollowedCompaniesIDS] = useState([])
    const fetchFollowedCompanies = async () => {
        await dispatch(getFollowedCompanies()).then((response) => {
            if (!response.error) {
                const newID = response.payload.companies.map((company) => company.id)
                setFollowedCompaniesIDS(newID);
                localStorage.setItem('FollowedCompaniesIDS', JSON.stringify(newID));
                // console.log(response.payload.interviews)
                // console.log(FollowedInterviewsIDS)
            }
        })
    }


    const fetchAllCompanies = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/company/get_companies`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            setCompanies(response.data.companies)
            setTotalPages(response.data.totalPages)
            //setTotalPages(Math.floor((response.data.companies.length) / 6) + 1)
            console.log(response.data)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        const storedFollowedCompaniesIDS = localStorage.getItem('FollowedCompaniesIDS');
        if (storedFollowedCompaniesIDS) {
            setFollowedCompaniesIDS(JSON.parse(storedFollowedCompaniesIDS));
        } else {
            fetchFollowedCompanies();
        }
        setCompanies(null);
        fetchAllCompanies();
        // eslint-disable-next-line
    }, [active, isDeleted])
    return (
        <div>
            <InterviewsContext.Provider value={{}}>
            <Header />
                <div className='w-[80%] border border-borderColor rounded-2xl mx-auto min-h-[80vh] overflow-x-hidden mt-[100px] pt-5 ps-3'>
                    
                    {isLoading ? <div className='fixed inset-0 flex items-center justify-center bg-opacity-50 z-50'>
                        <Spinner color="blue" size="5xl" className="h-12 w-12" />
                    </div> : ''}
                    <div className='flex flex-row space-x-2'>
                        <MdWork className='text-white text-4xl' />
                        <h1 className='text-white text-3xl'>Companies You can Follow</h1>
                    </div>
                    {!isLoading && Companies ?
                        <div className='flex flex-row flex-wrap  px-[5%] py-[2%] justify-center mt-12 '>
                            {Companies.map((company) => <CompanyCard id={company.id} comapanyImage={company.image} address={company.address} companyname={company.name} website={company.website} />)}
                        </div> : ''}
                    {totalPages && totalPages !== 0 ?
                        <div className={`flex items-center justify-center gap-4 abosolute mb-[50px] overflow-x-hidden ${!Companies ? 'mt-[80vh]' : ''} ${isLoading && Companies ? 'mt-[80vh]' : ''}`}>
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
                        </div> :
                        <div className='flex justify-center items-center'>
                            {totalPages === 0 ?
                                <div className='flex flex-col'>
                                    <h1 className='text-3xl text-gray-400 font-bold'>No Companies available</h1>
                                </div>
                                : ''}
                        </div>
                    }
                </div>

            </InterviewsContext.Provider>
        </div>
    )
}

export default UserCompanies
