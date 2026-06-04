import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { authDataContext } from './AuthContext.jsx'

export const userDataContext = createContext()

function UserContext({ children }) {
  let [userData, setUserData] = useState(null)
  
  // 1. ADDED: Loading state initialized to true
  let [isLoading, setIsLoading] = useState(true) 
  
  let { serverUrl } = useContext(authDataContext)
  
  let [reportData, setReportData] = useState([])
  
  
  let [profileData, setProfileData] = useState({
    _id: '',
    name: '',
    email:''
  })
  
  let navigate = useNavigate()

  const getCurrentUser = async () => {
   
    setIsLoading(true); 
    
    try {
      let result = await axios.get(serverUrl + "/currentuser", { withCredentials: true })
      console.log(result.data)
      setUserData(result.data)
      setProfileData(result.data) 
    } catch (error) {
      console.log(error);
      setUserData(null)
    } finally {
  
      setIsLoading(false);
    }
  }

  const getReport = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/post/getreport", {
        withCredentials: true
      })
      setReportData(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  // const handleGetProfile = async (userName) => {
  //   try {
  //     let result = await axios.get(serverUrl + `/api/user/profile/${userName}`, {
  //       withCredentials: true
  //     })
  //     setProfileData(result.data)
  //     navigate("/profile")
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  useEffect(() => {
    getCurrentUser();
    // getReport()
  }, []);

  
  const value = {
    userData, setUserData, isLoading, reportData, setReportData, getReport, profileData, setProfileData
  }

  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext