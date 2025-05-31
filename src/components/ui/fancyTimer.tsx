import React from 'react';
import styled from 'styled-components';

const FancyTimer = ({gameStateTime} : any) => {
  console.log("gameStateTime", gameStateTime.formatted);
  // Timer logic
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTime((prevTime) => prevTime + 1);
  //   }, 1000); // Update every second

  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, []);

  // Format time as MM:SS
  // const formatTime = (seconds : any) => {
  //   const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  //   const secs = (seconds % 60).toString().padStart(2, '0');
  //   return `${minutes}:${secs}`;
  // };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="loader"><span /></div>
        <div className="loader"><span /></div>
        <div className="loader"><i /></div>
        <div className="loader"><i /></div>
        <div className="timer">{gameStateTime.formatted}</div> {/* Timer display */}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
  position: relative;
  display: flex;
  height: 140px;
  width: 100%;
  justify-content: center;
  align-items: center;
  shape-rendering: crispEdges;
  image-rendering: pixelated, crisp-edges, -moz-crisp-edges;
}

  .loader {
    position: absolute;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    animation: anim 2s linear infinite;
    background: transparent;
  }

  .loader:nth-child(2),
  .loader:nth-child(4) {
    animation-delay: -1s;
    filter: hue-rotate(290deg);
    box-sizing: border-box;
    clear: initial;
  }

  @keyframes anim {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loader:nth-child(1):before,
  .loader:nth-child(2):before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(to top, transparent, rgba(223, 17, 17, 0.5));
    background-size: 100px 180px;
    background-repeat: no-repeat;
    border-top-left-radius: 80px;
    border-bottom-left-radius: 80px;
    filter: blur(0.65px);
  }

  i {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    background:rgb(244, 232, 54);
    border-radius: 50%;
    z-index: 10;
    box-shadow:
      0 0 10px rgb(207, 237, 36),
      0 0 20px rgb(207, 237, 36),
      0 0 30px rgb(207, 237, 36),
      0 0 40px rgb(207, 237, 36),
      0 0 50px rgb(207, 237, 36),
      0 0 60px rgb(207, 237, 36),
      0 0 70px rgb(207, 237, 36),
      0 0 80px rgb(207, 237, 36),
      0 0 90px rgb(207, 237, 36),
      0 0 100px rgb(207, 237, 36);
    filter: blur(5px);
  }

  .loader span {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    background: #000;
    border-radius: 50%;
    z-index: 1;
    filter: blur(3.4px);
    box-shadow: 0 0 4px rgba(13, 18, 18, 0.1);
  }
    
  .timer {
    position: absolute;
    z-index: 15;
    color:rgb(223, 213, 18); /* Match the neon color scheme */
    font-size: 24px;
    font-family: 'Arial', sans-serif;
    text-align: center;
    text-shadow: 0 0 5px rgb(216, 216, 24), 0 0 10px rgb(222, 169, 10); /* Glow effect */
  }`;

export default FancyTimer;