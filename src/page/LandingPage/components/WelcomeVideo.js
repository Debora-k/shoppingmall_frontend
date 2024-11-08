import React, { useEffect, useRef } from "react";
import video from "../../../handm_video.webm";
import "../style/video.style.css";

const WelcomeVideo =() => {
    useEffect (() => {
        
    })
        return (
            <div>
                <video src={video} autoPlay muted loop playsInline/>
            </div>
        );

};

export default WelcomeVideo;