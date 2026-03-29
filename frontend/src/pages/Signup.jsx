import React, { useContext, useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { Search, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, User } from "lucide-react"

// Assuming your contexts are exported from these paths
import { authDataContext } from '../context/AuthContext.jsx'
// import { userDataContext } from '../context/UserContext'

function Signup() {
  let [show, setShow] = useState(false)
  let { serverUrl } = useContext(authDataContext)
  // let { userData, setUserData } = useContext(userDataContext)
  let navigate = useNavigate()
  
  let [name, setName] = useState("")
  // let [lastName, setLastName] = useState("")
  // let [userName, setUserName] = useState("")
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setLoading] = useState(false)
  let [err, setErr] = useState("")

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      
      let result = await axios.post(serverUrl + "/api/auth/signup", {
        name,
        email,
        password
      }, { withCredentials: true })
      
      console.log(result)
      // setUserData(result.data)
      navigate("/")
      setErr("")
      setLoading(false)
      setName("")
      
      setEmail("")
      setPassword("")
     
    } catch (error) {
      setErr(error?.response?.data?.message || "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-8">
      
      {/* Brand Logo */}
      <div className="flex items-center gap-2 mb-8 transition-opacity hover:opacity-90">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
          <Search className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-slate-900">MatchFound</span>
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Create an account</h1>
          <p className="text-sm text-slate-500">Join our community to report and find items.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          
          {/* First & Last Name Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            
            
          </div>

          

          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={show ? "text" : "password"}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-3 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 focus:outline-none"
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error Message Alert */}
          {err && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{err}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors shadow-sm mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Redirect to Login */}
        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup