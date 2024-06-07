import React, { useState, useEffect } from 'react';
import googleImage from '../../assets/unknown.png';
import { Input, Button } from '@material-tailwind/react';
import axios from 'axios';
import { initializeApp } from "firebase/app";
import { ref, uploadBytes, getStorage, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'

const Information_User = ({ info }) => {
    const [formData, setFormData] = useState({
        image: googleImage,
        firstname: '',
        lastname: '',
        email: '',
        job: ''
    });
    const firebaseConfig = {
        apiKey: "AIzaSyCmnXe8tNz8Zq04eOgKlvcnvvy_IFg-l6s",
        authDomain: "ainterview-5e7bf.firebaseapp.com",
        projectId: "ainterview-5e7bf",
        storageBucket: "ainterview-5e7bf.appspot.com",
        messagingSenderId: "579235073668",
        appId: "1:579235073668:web:06216d7bbb9e9bcf843cd1",
        measurementId: "G-SZL1XYR7XN"
    };
    const [image, setImage] = useState(info?.image);
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageRef = ref(storage, `/images/${file.name + v4()}`);
            uploadBytes(imageRef, file).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    setImage(url);
                    setFormData({ ...formData, image: url });
                    // setUserData({ ...formData, image: url });
                }).catch((error) => {
                    console.error('Error getting download URL:', error);
                });
            }).catch((error) => {
                console.error('Error uploading file:', error);
            });
        }
    };
    useEffect(() => {
        setFormData({
            image: info.image || googleImage,
            firstname: info.firstname,
            lastname: info.lastname,
            email: info.email,
            job: info.job,
            role: info.role,
            id: info.id
            

        });
    }, [info]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/auth/updateUser`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
    // const handleUpdate = async () => {



    // };

    return (
        <div className='flex flex-col mt-2'>
            <div className='relative flex items-center justify-center'>
                <img className="w-20 h-20 rounded-full border-4 border-white" src={formData.image} alt="Profile" />
                <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="fileInput"
                />
                <label htmlFor="fileInput" className='absolute bottom-0 ms-14 bg-green-600 text-white rounded-full p-2 cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                </label>
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
