import React, { useState, useEffect } from 'react'
import Header from "../../../components/Header/Header";
import { Card, Typography, Button, CardBody, Avatar, IconButton} from "@material-tailwind/react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchingFollowers } from '../../../services/manager/managerSlice';
import { Spinner } from '@material-tailwind/react';
import { ImSad } from "react-icons/im";
const TABLE_HEAD = ["Member", "Job", "Email"];
const Followers = () => {
    const { isLoading } = useSelector((state) => state.Manager)
    const dispatch = useDispatch()  
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
  const handlingFetching = async () => {
    await dispatch(fetchingFollowers(active)).then((response) => {
      if (!response.error) {
        setData(response.payload.followers)
        setTotalPages(response.payload.totalPages)
      }
      })
    }
    useEffect(() => {
      handlingFetching()
      console.log(!isLoading && data)
        // eslint-disable-next-line
    }, [active])
    return (
      <div className="w-full min-h-[80vh] overflow-x-hidden mt-[100px] flex justify-center items-center">
      <Header />
      {isLoading ? <div className='fixed inset-0 flex items-center justify-center bg-opacity-50 z-50'>
        <Spinner color="blue" size="5xl" className="h-12 w-12" />
      </div> : ''}
      {data?.length !== 0 && !isLoading ? (
        <div className="min-w-[40%] mb-[50px]">
          <Card className="bg-transparent border-[1px] border-borderColor mb-[50px]">
            <div className="w-[100%] text-center mt-[15px] text-[25px] font-bold text-white">
              Followers
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
            {totalPages !== 0 ?
              <div className={`w-full flex items-center justify-center gap-4 mb-[50px] overflow-x-hidden ${!data ? 'mt-[80vh]' : ''} ${isLoading && data ? 'mt-[80vh]' : ''}`}>
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
              </div> :''
              }
          </div> ) : data?.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <ImSad className="text-9xl text-gray-400" />
              <h1 className="text-3xl text-gray-400 font-bold">No Followers available</h1>
            </div>
          ) : ''
        }
    </div>
  )
}

export default Followers