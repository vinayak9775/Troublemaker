import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./VideoCall.css";
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";


const VideoCall = () => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem("token");
    // const localVideoRef = useRef(null);
    // const remoteVideoRef = useRef(null);
    // const peerConnection = useRef(null);
    // const socket = useRef(null);
    // const [localStream, setLocalStream] = useState(null);
    // const localVideoRef = useRef(null);
    // const remoteVideoRef = useRef(null);
    // const peerConnection = useRef(null);
    // const socket = useRef(null);
    // const [localStream, setLocalStream] = useState(null);

    // const iceServers = {
    //     iceServers: [
    //         { urls: "stun:stun.l.google.com:19302" } // Public STUN server
    //     ],
    // };

    // useEffect(() => {
    //     // Initialize socket connection
    //     socket.current = io(`${port}`);

    //     // Get user media
    //     navigator.mediaDevices
    //         .getUserMedia({ video: true, audio: true })
    //         .then((stream) => {
    //             setLocalStream(stream);
    //             if (localVideoRef.current) {
    //                 localVideoRef.current.srcObject = stream;
    //             }
    //         })
    //         .catch((error) => console.error("Error accessing media devices:", error));

    //     // Socket events for signaling
    //     socket.current.on("offer", handleReceiveOffer);
    //     socket.current.on("answer", handleReceiveAnswer);
    //     socket.current.on("ice-candidate", handleReceiveIceCandidate);

    //     return () => {
    //         socket.current.disconnect();
    //     };
    // }, []);

    // const createPeerConnection = () => {
    //     const pc = new RTCPeerConnection(iceServers);

    //     pc.onicecandidate = (event) => {
    //         if (event.candidate) {
    //             socket.current.emit("ice-candidate", event.candidate);
    //         }
    //     };

    //     pc.ontrack = (event) => {
    //         if (remoteVideoRef.current) {
    //             remoteVideoRef.current.srcObject = event.streams[0];
    //         }
    //     };

    //     localStream.getTracks().forEach((track) => {
    //         pc.addTrack(track, localStream);
    //     });

    //     return pc;
    // };

    // const handleCall = async () => {
    //     peerConnection.current = createPeerConnection();

    //     const offer = await peerConnection.current.createOffer();
    //     await peerConnection.current.setLocalDescription(offer);

    //     socket.current.emit("offer", offer);
    // };

    // const handleReceiveOffer = async (offer) => {
    //     peerConnection.current = createPeerConnection();
    //     await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));

    //     const answer = await peerConnection.current.createAnswer();
    //     await peerConnection.current.setLocalDescription(answer);

    //     socket.current.emit("answer", answer);
    // };

    // const handleReceiveAnswer = async (answer) => {
    //     await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    // };

    // const handleReceiveIceCandidate = async (candidate) => {
    //     await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    // };

    ///// This is third party library to use vdo call ////
    // const [roomID, setRoomID] = useState(""); // Store room ID
    // const [inCall, setInCall] = useState(false); // Check if user is in a call

    // const startCall = () => {
    //     if (!roomID.trim()) {
    //         alert("Please enter a Room ID!");
    //         return;
    //     }
    //     setInCall(true);
    // };

    // const myMeeting = async (element) => {
    //     if (!element) return;

    //     const appID = 1158068054; // Replace with your App ID
    //     const serverSecret = "YOUR_ZEGOCLOUD_SERVER_SECRET"; // Replace with your Server Secret
    //     const userID = Date.now().toString(); // Generate unique user ID

    //     const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
    //         appID,
    //         serverSecret,
    //         roomID,
    //         userID,
    //         "User" + Math.floor(Math.random() * 1000)
    //     );

    //     const zp = ZegoUIKitPrebuilt.create(kitToken);
    //     zp.joinRoom({
    //         container: element,
    //         scenario: {
    //             mode: ZegoUIKitPrebuilt.OneONoneCall, // Change to GroupCall for group calls
    //         },
    //     });
    // };
    // const [zegoInstance, setZegoInstance] = useState(null);

    // const userID = "2448";
    // const userName = "2448";
    // const appID = 1158068054;
    // const serverSecret = "da324915bfc2bcf083d59e546d3bddcf";

    // useEffect(() => {
    //     const loadZegoSDK = async () => {
    //         try {
    //             const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
    //             const { ZIM } = await import("zego-zim-web");

    //             const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(
    //                 appID,
    //                 serverSecret,
    //                 null,
    //                 userID,
    //                 userName
    //             );

    //             const zp = ZegoUIKitPrebuilt.create(TOKEN);
    //             zp.addPlugins({ ZIM });

    //             zp.setCallInvitationConfig({
    //                 ringtoneConfig: {
    //                     incomingCallUrl: "https://www.speroems.com/zegovideo/medicalring.mp3",
    //                     outgoingCallUrl: "https://www.speroems.com/zegovideo/medicalring.mp3",
    //                 },
    //             });

    //             setZegoInstance(zp); // Save instance in state
    //         } catch (error) {
    //             console.error("Error loading Zego SDK:", error);
    //         }
    //     };

    //     loadZegoSDK();
    // }, []);

    // const invite = async () => {
    //     if (!zegoInstance) {
    //         console.error("Zego SDK not initialized yet.");
    //         return;
    //     }

    //     const targetUser = {
    //         userID: "9293",
    //         userName: "9293",
    //     };

    //     zegoInstance.sendCallInvitation({
    //         callees: [targetUser],
    //         callType: zegoInstance.InvitationTypeVideoCall,
    //         timeout: 60,
    //     }).then((res) => {
    //         console.warn("Call Invitation Sent:", res);
    //     }).catch((err) => {
    //         console.warn("Call Invitation Error:", err);
    //     });
    // };

    return (
        // <div className="video-call">
        //     {/* <video ref={localVideoRef} autoPlay muted playsInline /> */}
        //     {/* <video ref={remoteVideoRef} autoPlay playsInline /> */}
        //     {/* <button onClick={handleCall}>Call</button> */}
        //     {/* <ZegoUIKitPrebuilt
        //         roomID={roomID}
        //         kitToken={kitToken}
        //         userID={userID}
        //         userName={userName}
        //         config={{
        //             videoCall: true,
        //             showScreenSharingButton: true,
        //         }}
        //     /> */}
        //     {!inCall ? (
        //         <>
        //             <h1>Enter Room ID to Join Video Call</h1>
        //             <input
        //                 type="text"
        //                 placeholder="Enter Room ID"
        //                 value={roomID}
        //                 onChange={(e) => setRoomID(e.target.value)}
        //                 style={{ padding: "10px", fontSize: "16px" }}
        //             />
        //             <br /><br />
        //             <button onClick={startCall} style={{ padding: "10px 20px", fontSize: "16px" }}>
        //                 Start Video Call
        //             </button>
        //         </>
        //     ) : (
        //         <div ref={myMeeting} style={{ width: "100%", height: "100vh" }} />
        //     )}
        // </div>
        <div className="flex justify-center items-center h-screen">
            {/* <button
                className="px-4 py-2 text-white font-bold rounded-md bg-gradient-to-r from-teal-400 to-gray-600 hover:opacity-80"
                onClick={invite}
                disabled={!zegoInstance}
            >
                {zegoInstance ? "Call" : "Loading..."}
            </button> */}
        </div>
    );
};

export default VideoCall;
