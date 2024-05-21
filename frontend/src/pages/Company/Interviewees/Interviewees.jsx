import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Header from "../../../components/Header/Header";
import { Card, Typography, CardBody, Avatar, Button, IconButton, Spinner } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { fetchingInterviewees } from '../../../services/manager/managerSlice';
const TABLE_HEAD = ["Member", "Job", "Email"]; 
const Interviewees = () => {
  const navigate = useNavigate()
  const dispacth = useDispatch()
  const { isLoading } = useSelector((state) => state.Manager)
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [totalPages, setTotalPages] = useState(null)
  const [active, setActive] = React.useState(1);
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
  const fetching_interviewees = async () => {
    await dispacth(fetchingInterviewees({id : id , page : active})).then((response) => {
      if (!response.error) {
        setData(response.payload.interviewees)
        setTotalPages(response.payload.totalPages)
      }
    })
  }
  useEffect(() => {
    fetching_interviewees()
    // eslint-disable-next-line
  }, [active])
  
  return (
    <div className="w-full min-h-[80vh] overflow-x-hidden flex-col flex justify-center items-center mt-[100px]">
      <Header />
      {isLoading ? <div className='fixed inset-0 flex items-center justify-center bg-opacity-50 z-50'>
        <Spinner color="blue" size="5xl" className="h-12 w-12" />
      </div> : ''}
      {!isLoading && data ?
        <div className="min-w-[50%] mb-[50px]">
          <Card className="bg-transparent border-[1px] border-borderColor ">
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
                  ({ id , image, firstname, email, job, lastname}, index) => {
                    const isLast = index === data.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-gray-700";
    
                    return (
                      <tr key={id}>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Avatar src={image} alt={firstname+lastname} size="sm" />
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
                      </tr>
                    );
                  },
                )}
              </tbody>
              </table>
            </CardBody>
          </Card>
        </div> : ''}
      {totalPages && totalPages !== 0 ?
        <div className={`flex items-center justify-center gap-4 abosolute mb-[50px] overflow-x-hidden ${!data ? 'mt-[80vh]' : ''} ${isLoading && data ? 'mt-[80vh]' : ''}`}>
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
        </div> :
        <div className='flex justify-center items-center'>
          {totalPages === 0 ?
            <div className='flex flex-col'>
              <h1 className='text-3xl text-gray-400 font-bold'>No interviews available</h1>
              <button className='interview-button' onClick={() => navigate('/createInterview')}>Create Interview</button>
            </div>
            : ''}
        </div>
      }
    </div>
  );
}
export default Interviewees