import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import Header from "../../../components/Header/Header";
import { Card, Typography, Button, CardBody, Avatar, IconButton } from "@material-tailwind/react";
import { useSelector } from 'react-redux';
import { Spinner } from '@material-tailwind/react';
import { ImSad } from "react-icons/im";
import axios from "axios"
import Modal from '../../../components/Modal/Modal';
import { getAllScores } from '../../../services/manager/managerSlice';
const TABLE_HEAD = ["Member", "Email", "Technical Score" , "Audio Score" , "Video Score" , "MCQ/TF Score" , "Final Score" , '' , ''];
const Results = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [isClicked, setIsClicked] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const { isLoading } = useSelector((state) => state.Manager)
  const [totalPages, setTotalPages] = useState(null)
  const [data, setData] = useState(null)
  const [active, setActive] = useState(1);
  const getItemProps = (index) =>
  ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => setActive(index),
  });
  const next = () => {
    setActive(active + 1);
    setData(null)
  };
  const prev = () => {
    setActive(active - 1);
    setData(null)
  };
  const closeModal = () => {
    setShowModal(false)
  }
  const fetchingScores = async () => {
    // await axios.get(`${process.env.REACT_APP_BASE_URL}/scores/get_scores/${id}?page=${active}`, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   }
    // })
    //   .then((response) => { console.log(response); setTotalPages(response.data.total_pages); setData(response.data.scores)}).catch((error) => console.log(error))
    await dispatch(getAllScores({ id, active })).then((response) => {
      if (!response.error) {
        setTotalPages(response.payload.total_pages)
        setData(response.payload.scores)
      }
    })
  }
  const handleAccept = async (user_id) => {
    await axios.patch(`${process.env.REACT_APP_BASE_URL}/auth/sendAcceptanceEmail/${user_id}/${id}`, {} ,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((response) => { console.log(response); setShowModal(true) }).catch((error) => console.log(error))
  }
  const handleReject = async (user_id) => {
    await axios.patch(`${process.env.REACT_APP_BASE_URL}/auth/sendRejectionEmail/${user_id}/${id}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((response) => { console.log(response); setShowModal(true) }).catch((error) => console.log(error))
  }
  useEffect(() => {
    fetchingScores()
    // eslint-disable-next-line
  }, [active])
  return (
    <div className="w-full min-h-[85vh] overflow-x-hidden mt-[100px] flex justify-center">
      <Header />
      <Modal show={showModal} close={closeModal} message="Email sent successfully to interviewee" /> 
      {isLoading ? <div className='fixed inset-0 flex items-center justify-center bg-opacity-50 z-50'>
        <Spinner color="blue" size="5xl" className="h-12 w-12" />
      </div> : ''}
      {data && !isLoading ? (
        <div className="min-w-[75%] mb-[50px]">
          <Card className="bg-transparent border-[1px] border-borderColor mb-[50px]">
            <div className="w-[100%] text-center mt-[15px] text-[25px] font-bold text-white">
              Interviewees Scores
            </div>
            <CardBody className="p-0">
              <table className="mt-4 w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-y border-gray-700 bg-transparent p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold text-white"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.map(
                    ({ id, image, firstname, email, images_Score, lastname, audio_Score, nlp_Score, final_Score, exam_Score}, index) => {
                      const isLast = index === data.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-gray-700";

                      return (
                        <tr key={id}>
                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              <Avatar src={image} alt={firstname + lastname} size="sm" />
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="text-white font-bold"
                                >
                                  {firstname + ' ' + lastname}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-white"
                            >
                              {email}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="text-white text-center"
                              >
                                {nlp_Score}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="text-white text-center"
                              >
                                {audio_Score}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="text-white text-center"
                              >
                                {images_Score}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="text-white text-center"
                              >
                                {exam_Score ? exam_Score + '%' : '-'}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="text-white text-center"
                              >
                                {final_Score}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <button className='text-white font-bold bg-red-600 rounded-[20px] px-[17%] py-[8%] mr-4' onClick={() => handleReject(id)}>Reject</button>
                          </td>
                          <td className={classes}>
                            <button className='text-white font-bold bg-green-600 rounded-[20px] px-[17%] py-[8%] mr-4' onClick={() => handleAccept(id)}>Accept</button>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </CardBody>
          </Card>
          {totalPages !== 0 ?
            <div className={`w-full flex items-center justify-center gap-4 mb-[50px] overflow-x-hidden absolute left-1/2 top-[88vh] transform -translate-x-1/2`}>
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
            </div> : ''
          }
        </div>) : !isLoading && !data ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <ImSad className="text-9xl text-gray-400" />
            <h1 className="text-3xl text-gray-400 font-bold">No Scores Available</h1>
          </div>
        ) : ''
      }
    </div>
  )
}

export default Results