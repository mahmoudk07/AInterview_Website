import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createInterview } from '../../services/manager/managerSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Template = ({ title, questions, job_title, job_description, job_opportunity }) => {
    const dispatch = useDispatch();
    const [data, setData] = useState({
        job_title: job_title,
        job_description: job_description,
        job_opportunity: job_opportunity,
        Date: '',
        Time: '',
        questions: questions.map((question, index) => ({
            [`Q${index + 1}`]: question.question,
            Answer: question.answer,
            hint_keywords: question.keywords.join(', '),
            Type: 'Technical'
        }))
    });

    const handleDateChange = (e) => {
        setData({ ...data, Date: e.target.value });
    };

    const handleTimeChange = (e) => {
        setData({ ...data, Time: e.target.value });
    };

    const handleSubmit = async () => {
        await dispatch(createInterview(data)).then((response) => {
            if (response.error) {
                toast.error("Failed to create interview: " + response.error.message);
            } else {
                toast.success("Interview created successfully!");
            }
        });
    };

    return (
        <div className='flex-1 min-w-[300px] mt-24 max-w-[500px] border border-borderColor px-4 py-4 bg-transparent flex flex-col'>
            <ToastContainer position='top-center' />
            <h1 className='text-white text-3xl items-center mx-auto'>{title}</h1>
            {questions.map((question, index) => (
                <div key={index} className='flex flex-col items-start justify-start mt-4'>
                    <h1 className='text-white text-xl'>Question {index + 1}</h1>
                    <p className='text-white'>{question.question}</p>
                    <h1 className='text-white mt-3'>Answer</h1>
                    <p className='text-white'>{question.answer}</p>
                    <p className='text-white mt-3'>Keywords: {question.keywords.join(', ')}</p>
                </div>
            ))}
            <div className='flex gap-4 mb-6 mt-4 relative'>
                <input
                    type="date"
                    value={data.Date}
                    onChange={handleDateChange}
                    className='inputDate'
                />
                <input
                    type="time"
                    value={data.Time}
                    onChange={handleTimeChange}
                    className='inputTime'
                />
            </div>
            <div className='flex items-end justify-end mt-4'>
                <button onClick={handleSubmit} className='green-button'>
                    Create
                </button>
            </div>
        </div>
    );
};

export default Template;
