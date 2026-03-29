import React, { createContext, useContext, useEffect, useState } from 'react'

import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { authDataContext } from './AuthContext.jsx'

export const userDataContext = createContext()

function UserContext({ children }) {
  let [userData, setUserData] = useState(null)
  let { serverUrl } = useContext(authDataContext)
 
  let [reportData, setReportData] = useState([])
  
  // FIXED: Initialize profileData as an object instead of array
  let [profileData, setProfileData] = useState({
    _id: '',
    name: '',
   email:''
    
  })
  
  let navigate = useNavigate()

  const getCurrentUser = async () => {
    try {
      let result = await axios.get(serverUrl + "/currentuser", { withCredentials: true })
      console.log(result.data)
      setUserData(result.data)
      setProfileData(result.data) // FIXED: Set current user as initial profile
      return
    } catch (error) {
      console.log(error);
      setUserData(null)
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
    userData, setUserData,  reportData, setReportData, getReport, profileData, setProfileData
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
