import React, { useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { userDataContext } from "../context/UserContext.jsx";
import { ArrowLeft } from "lucide-react";

export function VideoCall() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { userData } = useContext(userDataContext);
  
  // We use references so React doesn't accidentally join the room twice
  const containerRef = useRef(null);
  const zpRef = useRef(null); 

  useEffect(() => {
    // Prevent running if the container isn't ready on the screen
    if (!containerRef.current) return;

    const startCall = async () => {
      // 1. VERIFY YOUR KEYS! (I see your App ID is correct)
const appID = Number(import.meta.env.VITE_ZEGO_APP_ID); 
      const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

    //   if (!serverSecret || serverSecret === "b55d4d88bfeaacc428f0f5e170b571b1") {
    //       alert("Please paste your real ZEGOCLOUD Server Secret in the code!");
    //       return;
    //   }

      // 2. Generate the Token (We force toString() just to be perfectly safe)
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        userData?._id?.toString() || Date.now().toString(), 
        userData?.name               
      );

      // 3. Create the UI Kit instance
      zpRef.current = ZegoUIKitPrebuilt.create(kitToken);

      // 4. Join the room safely
      zpRef.current.joinRoom({
        container: containerRef.current,
        sharedLinks: [
          {
            name: "Copy Call Link",
            url: window.location.origin + window.location.pathname,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
        onLeaveRoom: () => {
          navigate("/messages");
        },
      });
    };

    startCall();

    // 5. CRITICAL CLEANUP: When you leave the page, destroy the call instance
    // This totally stops the "joinRoom repeat!!" crash!
    return () => {
      if (zpRef.current) {
        zpRef.current.destroy();
      }
    };
  }, [roomId, userData, navigate]); // Only run when these change

  return (
    <div className="h-screen w-screen bg-gray-900 relative">
      {/* Custom Back Button */}
      <button 
        onClick={() => {
            // Manually destroy the call if they click the custom back arrow
            if (zpRef.current) zpRef.current.destroy();
            navigate("/messages");
        }}
        className="absolute top-4 left-4 z-50 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-md transition-all cursor-pointer"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      
      {/* The ZEGOCLOUD Video Container */}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}