import React from "react"
import { useNavigate } from "react-router-dom"
import { Search, MapPin, Bell, Shield, Users, ArrowRight, Clock, CheckCircle2 } from "lucide-react"

const stats = [
  { label: "Items Reunited", value: "12,847", icon: CheckCircle2 },
  { label: "Active Users", value: "45,230", icon: Users },
  { label: "Avg. Match Time", value: "< 24hrs", icon: Clock },
]

const recentMatches = [
  {
    id: 1,
    lostItem: "Golden Retriever",
    foundItem: "Dog spotted near park",
    matchedAt: "2 hours ago",
    status: "connected",
  },
  {
    id: 2,
    lostItem: "MacBook Pro",
    foundItem: "Laptop at coffee shop",
    matchedAt: "5 hours ago",
    status: "connected",
  },
  {
    id: 3,
    lostItem: "Car Keys",
    foundItem: "Keys found at gym",
    matchedAt: "Yesterday",
    status: "reunited",
  },
]

export function Home() {
  const navigate = useNavigate(); // Added React Router navigation

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-8">
        <span className="inline-block bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium">
          Trusted by over 45,000 users
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight text-balance">
          Reuniting People with
          <br />
          <span className="text-blue-600">What Matters Most</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto text-pretty">
          Our AI-powered platform helps you find lost items faster by matching reports 
          and connecting you with people who can help.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <button 
            onClick={() => navigate("/report")}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Report an Item
            <ArrowRight className="h-4 w-4" />
          </button>
          <button 
            onClick={() => navigate("/browse")}
            className="inline-flex items-center justify-center bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-8 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Browse Lost & Found
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-blue-50">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Feature 1 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 group hover:shadow-md transition-shadow">
          <div className="p-3 rounded-lg bg-blue-50 w-fit mb-4 group-hover:bg-blue-100 transition-colors">
            <Search className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Smart Matching</h3>
          <p className="text-sm text-gray-500">
            AI analyzes descriptions and images to find potential matches automatically.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 group hover:shadow-md transition-shadow">
          <div className="p-3 rounded-lg bg-blue-50 w-fit mb-4 group-hover:bg-blue-100 transition-colors">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Location Tracking</h3>
          <p className="text-sm text-gray-500">
            Pinpoint where items were lost or found with our precise location system.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 group hover:shadow-md transition-shadow">
          <div className="p-3 rounded-lg bg-blue-50 w-fit mb-4 group-hover:bg-blue-100 transition-colors">
            <Bell className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Instant Alerts</h3>
          <p className="text-sm text-gray-500">
            Get notified immediately when a potential match is found for your item.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 group hover:shadow-md transition-shadow">
          <div className="p-3 rounded-lg bg-blue-50 w-fit mb-4 group-hover:bg-blue-100 transition-colors">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Secure Chat</h3>
          <p className="text-sm text-gray-500">
            Communicate safely with other users through our encrypted messaging.
          </p>
        </div>
      </section>

      {/* Recent Success Stories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Matches</h2>
            <p className="text-gray-500">See what's being reunited right now</p>
          </div>
          <button 
            onClick={() => navigate("/browse")}
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {recentMatches.map((match) => (
            <div key={match.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    <span className="text-red-600">{match.lostItem}</span>
                    {" matched with "}
                    <span className="text-green-600">{match.foundItem}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">{match.matchedAt}</p>
                </div>
              </div>
              
              <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize w-fit ${
                match.status === "reunited" 
                  ? "bg-gray-900 text-white" 
                  : "bg-gray-100 text-gray-700"
              }`}>
                {match.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}