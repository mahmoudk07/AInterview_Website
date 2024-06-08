import React, { useState } from 'react';
const Template = ({ title, questions }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    return (
        <div className='flex-1 min-w-[300px]  mt-24 max-w-[500px] border border-borderColor px-4 py-4 bg-transparent flex flex-col'>
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
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className='inputDate'
                />
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className='inputTime'
                />
            </div>
            <div className='flex items-end justify-end mt-4'>
                <button className='green-button'>
                    Create
                </button>
            </div>
        </div>
    );
};

export default Template;
