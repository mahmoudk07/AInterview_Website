import React, { useState } from 'react'
import Header from '../../../components/Header/Header';
import { Input } from '@material-tailwind/react';
import Modal from '../../../components/Modal/Modal';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCompany } from '../../../services/manager/managerSlice';
const CompanyCreation = () => {
    const navigate = useNavigate()
    // const { error } = useSelector((state) => state.Manager)
    const dispatch = useDispatch()
    const [showModal, setShowModal] = useState(false)
    const [data, setData] = useState({
        website: '',
        name: '',
        address: '',
        country: ''
    })
    const [responseMessage, setResponseMessage] = useState("")
    const [errorMessage , setErrorMessage] = useState("")
    const openModal = () => {
        setShowModal(true)
    }
    const closeModal = () => {
        setShowModal(false)
        if (responseMessage === "Company created successfully!")
            navigate('/')
        setErrorMessage("")
        setResponseMessage("")
    }
    const validateWebsite = (website) => {
        const urlRegex = /^(http|https):\/\/[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/;
        return urlRegex.test(website);
    };
    const validateName = (name) => {
        const nameRegex = /^[^0-9][a-zA-Z0-9]*$/;
        return nameRegex.test(name);
    };
    const validateAddress = (address) => {
        const addressRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9 ]+$/;
        return addressRegex.test(address);
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (data.address !== "" && data.website !== "" && data.name !== "" && data.country !== "")
            if (!validateWebsite(data.website))
              setResponseMessage("Please enter a valid website!")
            else if (!validateName(data.name))
              setResponseMessage("Please enter a valid name!")
            else if (!validateAddress(data.address))
              setResponseMessage("Please enter a valid address!")
            else {
                await dispatch(createCompany(data)).then((response) => {
                    console.log(response)
                    if (response.error)
                        setErrorMessage(response.payload.detail)
                    else{
                        setResponseMessage("Company created successfully!");
                        localStorage.setItem("isManager", response.payload.company.id)
                    }
                })
            }
        else
            setResponseMessage("Please enter all fields!")
        openModal()
    }

  return (
    <div className="w-full min-h-[80vh] overflow-x-hidden mt-[80px] flex items-center justify-center">
      <Header />
      <Modal show={showModal} message = {errorMessage === "" ? responseMessage : errorMessage} close = {closeModal} />
      <div className="bg-transparent border-[1px] border-borderColor w-[30%] h-[400px] py-[1%] px-[3%] rounded-[20px] ">
        <div className = 'text-center w-full mb-[30px]'>
          <span className="text-white font-bold text-[22px]">Company creation</span>
        </div>
        <div className = 'flex flex-col justify-center gap-y-5'>
            <Input type = 'text' variant="outlined" label="Website" color='white' onChange = {(e) => setData({...data , website: e.target.value})} />
            <Input type = 'text' variant="outlined" label="Name" color='white' onChange = {(e) => setData({...data , name: e.target.value})} />
            <Input type = 'text' variant="outlined" label="Address" color='white' onChange = {(e) => setData({...data , address : e.target.value})} />
            <Input type = 'text' variant="outlined" label="Country" color='white' onChange = {(e) => setData({...data , country: e.target.value})} />
        </div>
        <div className = 'flex items-center justify-end mt-[30px]'>
            <button className = 'font-bold py-[1%] px-[4%] text-white bg-green-600 rounded-[20px]' onClick = {handleSubmit}>Create</button>
        </div>
      </div>
    </div>
  );
}
export default CompanyCreation