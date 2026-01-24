import React from 'react';

const CameraFeed = () => {
    return (
        <div className="relative w-full max-w-lg mx-auto bg-black rounded-xl overflow-hidden">
            <video id="video-feed" autoPlay playsInline muted className="w-full h-full transform -scale-x-100"></video>
            {/* Overlay Canvas for Face Mesh drawing goes here */}
        </div>
    );
};
export default CameraFeed;
