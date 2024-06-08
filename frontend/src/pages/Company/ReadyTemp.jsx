import React from 'react';
import Template from './Template';
import Header from '../../components/Header/Header';

const ReadyTemp = () => {
    const frontendQuestions = [
        {
            question: 'What is a React.js component?',
            answer: 'A component is a reusable piece of UI in React, defined either as a function or a class.',
            keywords: ['Reusable', 'UI', 'Function', 'Class']
        },
        {
            question: 'What is JSX?',
            answer: 'JSX is a syntax extension for JavaScript that looks similar to XML or HTML and is used in React to describe the UI structure.',
            keywords: ['Syntax', 'JavaScript', 'UI']
        },
    ];

    const backendQuestions = [
        {
            question: 'What is a RESTful API?',
            answer: 'It is is an architectural style for designing networked applications using stateless protocols like GET,POST,PUT,Delete',
            keywords: ['RESTful', 'API', 'Stateless', 'GET', 'POST', 'PUT', 'DELETE']
        },
        {
            question: 'What is Node.js?',
            answer: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine that allows server-side scripting.',
            keywords: ['Node.js', 'JavaScript', 'Server-side', 'Runtime']
        },
    ];

    return (
        <div>
            <Header />
            <div className='flex flex-row flex-wrap px-[30px] gap-10 justify-center items-center'>
                <Template  job_title = 'Software Engineer' job_description = 'We are seeking a skilled and passionated Frontend Engineer' job_opportunity = 'Frontend Engineer'  title="Interview For Frontend Engineer" questions={frontendQuestions} />
                <Template  job_title = 'Software Engineer' job_description = 'We are seeking a skilled and passionated Backend Engineer' job_opportunity = 'Backend Engineer' title="Interview For Backend Engineer" questions={backendQuestions} />
            </div>
        </div>
    );
};

export default ReadyTemp;
