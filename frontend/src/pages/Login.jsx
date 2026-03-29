import React, { useContext, useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
// import axios from "axios"
import { Search, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"
import { authDataContext } from '../context/AuthContext.jsx'
// import { userDataContext } from '../context/UserContext.jsx'
import axios from 'axios'



function Login() {
  let [show, setShow] = useState(false)
  let { serverUrl } = useContext(authDataContext)
  // let { userData, setUserData } = useContext(userDataContext)
  let navigate = useNavigate()
  
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setLoading] = useState(false)
  let [err, setErr] = useState("")

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(serverUrl + "/api/auth/login", {
        email,
        password
      }, { withCredentials: true })
      
      // setUserData(result.data)
      navigate("/")
      setErr("")
      setLoading(false)
      setEmail("")
      setPassword("")
    } catch (error) {
      // Safely handle errors in case the API is down or format is different
      setErr(error?.response?.data?.message || "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      
      {/* Brand Logo (Positioned above the card) */}
      <div className="flex items-center gap-2 mb-8 transition-opacity hover:opacity-90">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
          <Search className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-slate-900">MatchFound</span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-sm text-slate-500">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5">
          
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
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors shadow-sm mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Redirect to Signup */}
        <p className="text-center text-sm text-slate-500 mt-8">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login