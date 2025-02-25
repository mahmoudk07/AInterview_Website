import React, { useState, useEffect } from 'react'
import { Card, Typography, Button, CardBody, Avatar, IconButton } from "@material-tailwind/react";
import Header from '../../../components/Header/Header'
import Modal from '../../../components/Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetching_companies } from '../../../services/admin/adminSlice';
import { Spinner } from '@material-tailwind/react';
import { deleteCompany } from '../../../services/admin/adminSlice';
const TABLE_HEAD = ["Company", "Website", "Address" , ' '];
const Companies = () => {
  const { isLoading } = useSelector((state) => state.Admin)
  const dispatch = useDispatch()
  const [data, setData] = useState(null)
  const [active, setActive] = useState(1);
  const [totalPages, setTotalPages] = useState(null)
  const [isDeleted, setIsDeleted] = useState(false)
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
    await dispatch(deleteCompany(id)).then((response) => {
      if (!response.error)
        setShowModal(true)
    })
  }
  const handling_fetching = async () => {
    await dispatch(fetching_companies(active)).then((response) => {
      if (!response.error) {
        setData(response.payload.companies)
        setTotalPages(response.payload.totalPages)
      }
    })
  }
  useEffect(() => {
    handling_fetching();
    // eslint-disable-next-line
  }, [active, isDeleted])
  return (
    <div className='w-full min-h-[85vh] overflow-x-hidden mt-[100px] flex justify-center'>
      <Header />
      <Modal show={showModal} close={closeModal} message="Company deleted successfully" />
      {isLoading ? <div className='fixed inset-0 flex items-center justify-center bg-opacity-50 z-50'>
        <Spinner color="blue" size="5xl" className="h-12 w-12" />
      </div> : ''}
      {!isLoading && data ?
        <div className="md:min-w-[50%] mb-[50px]">
          <Card className="bg-transparent border-[1px] border-borderColor mb-[30px]">
            <div className="w-[100%] text-center mt-[15px] text-[25px] font-bold text-white">
              Companies
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
                    ({ id, image, name, website, address }, index) => {
                      const isLast = index === data.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-gray-700";

                      return (
                        <tr key={id}>
                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              <Avatar src={image} alt={name} size="sm" />
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="text-white font-bold"
                                >
                                  {name}
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
                              {website}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-white"
                            >
                              {address}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <button className='text-white font-bold bg-red-600 rounded-[20px] px-[10%] py-[5%] mr-4' onClick={() => handleDelete(id)}>Delete</button>
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
            <div className={`w-full flex items-center gap-4 justify-center mb-[50px] overflow-x-hidden absolute left-1/2 top-[90vh] transform -translate-x-1/2`}>
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
            </div> : ''}
        </div> : ''}
    </div>
  )
}

export default Companies