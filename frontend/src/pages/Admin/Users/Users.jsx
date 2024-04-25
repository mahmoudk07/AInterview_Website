import React, { useState, useEffect } from 'react'
import { Card, Typography, Button, CardBody, Avatar, IconButton} from "@material-tailwind/react";
import Header from '../../../components/Header/Header'
import Modal from '../../../components/Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchin_interviewees } from '../../../services/admin/adminSlice';
import { Spinner } from '@material-tailwind/react';
import { deleteUser } from '../../../services/admin/adminSlice';
const TABLE_HEAD = ["Member", "Job", "Email" , 'role', ' '];
const Users = () => {
    const { isLoading } = useSelector((state) => state.Admin)
    const dispatch = useDispatch()
    const [data, setData] = useState(null) 
    const [active, setActive] = useState(1);
    const [totalPages, setTotalPages] = useState(null)
    const [isDeleted , setIsDeleted] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const closeModal = () => {
      setShowModal(false)
      setIsDeleted(!isDeleted)
    }
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
    const handleDelete = async (id) => {
      await dispatch(deleteUser(id)).then((response) => {
        if (!response.error)
          setShowModal(true)
      })
    }
    const handling_fetching = async () => {
        await dispatch(fetchin_interviewees(active)).then((response) => {
          if (!response.error) {
            setData(response.payload.users)
            setTotalPages(response.payload.totalPages)
          }
        })
    }
    useEffect(() => {
        handling_fetching();
        // eslint-disable-next-line
    }, [active, isDeleted])
  return (
    <div className='w-full min-h-[80vh] overflow-x-hidden mt-[100px] flex justify-center items-center'>
      <Header />
      <Modal show={showModal} close={closeModal} message="User deleted successfully" />
      {isLoading ? <div className='fixed inset-0 flex items-center justify-center bg-opacity-50 z-50'>
        <Spinner color="blue" size="5xl" className="h-12 w-12" />
      </div> : ''}
      {!isLoading && data ?
        <div className="md:min-w-[50%] mb-[50px]">
          <Card className="bg-transparent border-[1px] border-borderColor mb-[30px]">
            <div className="w-[100%] text-center mt-[15px] text-[25px] font-bold text-white">
              Interviewees
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
                  {data.map(
                    ({ id, image, firstname, email, job, lastname, role }, index) => {
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
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="text-white"
                              >
                                {job}
                              </Typography>
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
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-white"
                            >
                              {role}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <button className = 'text-white font-bold bg-red-600 rounded-[20px] px-[15%] py-[10%] mr-4' onClick={() => handleDelete(id)}>Delete</button>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </CardBody>
          </Card>
          <div className={`w-full flex items-center gap-4 ml-[20%] mb-[50px] overflow-x-hidden ${!data ? 'mt-[80vh]' : ''} ${isLoading && data ? 'mt-[80vh]' : ''}`}>
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
          </div>
        </div> : ''}
    </div>
  )
}

export default Users