import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Header from "../../../components/Header/Header";
import { Card, Typography, CardBody, Avatar, } from "@material-tailwind/react";
import axios from "axios"
const TABLE_HEAD = ["Member", "Job", "Email"]; 
const Interviewees = () => {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const fetching_interviewees = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/interview/get_interviewees/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then((response) => { setData(response.data.interviewees); console.log(response) }).catch((error) => console.log(error))
  }
  useEffect(() => {
    fetching_interviewees()
    // eslint-disable-next-line
  }, [])
  
  return (
    <div className="w-full min-h-[80vh] overflow-x-hidden flex justify-center items-center">
      <Header />
      {data ?
        <div className="min-w-[50%] mb-[50px] mt-[-100px] ">
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
    </div>
  );
}
export default Interviewees