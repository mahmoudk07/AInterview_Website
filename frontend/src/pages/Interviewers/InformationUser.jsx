import React, { useState, useEffect } from 'react';
import googleImage from '../../assets/unknown.png';
import { Input, Button } from '@material-tailwind/react';
import axios from 'axios';

const Information_User = ({ info }) => {
    const [formData, setFormData] = useState({
        image: googleImage,
        firstname: '',
        lastname: '',
        email: '',
        job: ''
    });

    useEffect(() => {
        setFormData({
            image: info.image || googleImage,
            firstname: info.firstname,
            lastname: info.lastname,
            email: info.email,
            job: info.job
        });
    }, [info]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // const handleUpdate = async () => {
    //     try {
    //         const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/user/updateUser`, formData, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`
    //             }
    //         });
    //         console.log(response);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    const handleUpdate = async () => {



    };

    return (
        <div className='flex flex-col mt-2'>
            <div className='flex items-center justify-center'>
                <img className="w-20 h-20 rounded-full border-4 border-white" src={formData.image} alt="Profile" />
            </div>
            <div className='mt-5 flex flex-start flex-col gap-5'>
                <h1 className='text-white text-bold text-3xl'>General Information</h1>
                <div className='flex flex-col md:flex-row items-center justify-center md:space-x-[5%] gap-y-6 md:gap-y-0'>
                    <Input
                        type='text'
                        variant="outlined"
                        label="Firstname"
                        color='white'
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                    />
                    <Input
                        type='text'
                        variant="outlined"
                        label="Lastname"
                        color='white'
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex flex-col md:flex-row items-center justify-center md:space-x-[5%] gap-y-6 md:gap-y-0'>
                    <Input
                        type="email"
                        variant="outlined"
                        label="Email"
                        color='white'
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <Input
                        variant="outlined"
                        label="Job"
                        color='white'
                        name="job"
                        value={formData.job}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex justify-end mt-4'>
                    <button className='text-[18px] font-bold text-white bg-green-600 outline-none border-none py-[8px] px-[20px] rounded-[20px] transition-all ease-in-out duration-300' onClick={handleUpdate}>
                        Update Information
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Information_User;
