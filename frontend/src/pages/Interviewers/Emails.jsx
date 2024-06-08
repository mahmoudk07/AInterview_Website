import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import { Button, IconButton } from "@material-tailwind/react";
import { useSelector, useDispatch } from 'react-redux';
import { Spinner } from '@material-tailwind/react';
import { ImSad } from "react-icons/im";
const Emails = () => {
    const [data, setData] = useState(null);
    const [totalPages, setTotalPages] = useState(null);
    const [active, setActive] = useState(1);
    const { isLoading } = useSelector((state) => state.User);
    const dispatch = useDispatch();

    const getItemProps = (index) => ({
        variant: active === index ? "filled" : "text",
        color: "gray",
        onClick: () => setActive(index),
    });

    const next = () => {
        setActive(active + 1);
        setData(null);
    };

    const prev = () => {
        setActive(active - 1);
        setData(null);
    };

    const fetchEmails = async () => {
        await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/get_emails?page=${active}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            setTotalPages(response.data.totalPages);
            setData(response.data.emails);
        }).catch((error) => console.log(error));
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    return (
        <div className="w-full min-h-[85vh] overflow-x-hidden mt-[100px] flex justify-center">
            <Header />
            {isLoading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                    <Spinner color="blue" size="5xl" className="h-12 w-12" />
                </div>
            ) : ''}
            {!isLoading && (
                <div className='w-full flex flex-col items-center gap-y-6'>
                    {data && data.map((email) => (
                        <div key={email.id} className='w-[80%] min-h-[20%] border-[1px] border-borderColor rounded-[10px] flex flex-col p-[2%] gap-y-[5px]'>
                            <span className='text-white font-bold text-[18px]'>Email subject: <span className={`${email.subject === 'Congratulations' ? 'text-green-500' : 'text-red-500'}`}>{email.subject}</span></span>
                            <span className='text-white font-bold text-[18px]'>Message: <span className='text-[#D3D3D3]'>{email.message}</span></span>
                        </div>
                    ))}
                    {data && data.length === 0 && (
                        <div className="flex flex-col items-center justify-center gap-4 mt-[200px]">
                            <ImSad className="text-9xl text-gray-400" />
                            <h1 className="text-3xl text-gray-400 font-bold">No Emails available</h1>
                        </div>
                    )}
                </div>
            )}
            {data && totalPages !== 0 && (
                <div className={`w-full flex items-center justify-center gap-4 mb-[50px] overflow-x-hidden absolute left-1/2 top-[88vh] transform -translate-x-1/2`}>
                    <Button
                        variant="text"
                        className="flex items-center gap-2 text-white font-bold border-[1px] border-borderColor text-[14px]"
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
            )}
        </div>
    );
};

export default Emails;
