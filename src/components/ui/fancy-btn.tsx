import React from "react";
import styled from "styled-components";
import {
  BLACK_NUMBERS,
  // cn,
  // getPlacementString,
  RED_NUMBERS,
} from "@/lib/utils";

const FancyButton = ({ handleColorBet , code , color, number }: any) => {
  return (
    <StyledWrapper color={color} onClick={() => handleColorBet(color === "red" ? RED_NUMBERS : BLACK_NUMBERS)}>
      <div>
        <div id="poda">
          <div className="glow" />
          <div className="darkBorderBg" />
          <div className="darkBorderBg" />
          <div className="darkBorderBg" />
          <div className="white" />
          <div className="border" />
          <div id="main">
            <div className="input">{code}</div>
            <div id="input-mask" />
            <div id="pink-mask" />
            <div className="filterBorder" />
            <div id="filter-icon">
              <span className="number">{number}</span>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .white,
  .border,
  .darkBorderBg,
  .glow {
    max-height: 42px; /* Reduced from 52px */
    max-width: 128px; /* Reduced from 160px */
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
    z-index: 99;
    border-radius: 7px; /* Reduced from 9px */
    filter: blur(2.4px); /* Reduced from 3px */
  }
  .number {
    color: #d6d6e6;
    font-size: 15px; /* Reduced from 12px */
    font-weight: bold;
  }
  .input {
    background-color: ${(props) => (props.color === "red" ? "#ad0707" : "#010201")};
    border: none;
    width: 120px; /* Reduced from 150px */
    height: 34px; /* Reduced from 42px */
    border-radius: 6px; /* Reduced from 8px */
    color: white;
    padding-inline: 6px; /* Reduced from 7px */
    font-size: 12px; /* Reduced from 14px */
    z-index: 101;
    margin: auto;
  }
  #main {
    z-index: 101;
  }
  #poda {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .input::placeholder {
    color: #c0b9c0;
  }
  .input:focus {
    outline: none;
  }
  #main:focus-within > #input-mask {
    display: none;
  }
  
  #pink-mask {
    pointer-events: none;
    width: 18px; /* Reduced from 22px */
    height: 12px; /* Reduced from 15px */
    position: absolute;
    background: #cf30aa;
    top: 6px; /* Reduced from 8px */
    left: 3px; /* Reduced from 4px */
    filter: blur(12px); /* Reduced from 15px */
    opacity: 0.8;
    transition: all 2s;
  }
  #main:hover > #pink-mask {
    animation: rotate 4s linear infinite;
    opacity: 0;
  }
  .white {
    max-height: 38px; /* Reduced from 47px */
    max-width: 120px; /* Reduced from 150px */
    border-radius: 6px; /* Reduced from 8px */
    filter: blur(1.6px); /* Reduced from 2px */
  }
  .white::before {
    content: "";
    z-index: 99;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(83deg);
    position: absolute;
    width: 120px; /* Reduced from 150px */
    height: 360px; /* Reduced from 450px */
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.4);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0) 0%,
      #a099d8,
      rgba(0, 0, 0, 0) 8%,
      rgba(0, 0, 0, 0) 50%,
      #dfa2da,
      rgba(0, 0, 0, 0) 58%
    );
    animation: rotate 4s linear infinite;
  }
  .border {
    max-height: 35px; /* Reduced from 44px */
    max-width: 120px; /* Reduced from 150px */
    border-radius: 6px; /* Reduced from 8px */
    filter: blur(0.4px); /* Reduced from 0.5px */
  }
  .border::before {
    content: "";
    z-index: 99;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(70deg);
    position: absolute;
    width: 120px; /* Reduced from 150px */
    height: 360px; /* Reduced from 450px */
    filter: brightness(1.3);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      #1c191c,
      #402fb5 5%,
      #1c191c 14%,
      #1c191c 50%,
      #cf30aa 60%,
      #1c191c 64%
    );
    animation: rotate 4s linear infinite;
  }
  .darkBorderBg {
    max-height: 39px; /* Reduced from 49px */
    max-width: 120px; /* Reduced from 150px */
  }
  .darkBorderBg::before {
    content: "";
    z-index: 99;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(82deg);
    position: absolute;
    width: 120px; /* Reduced from 150px */
    height: 360px; /* Reduced from 450px */
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #18116a,
      rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0) 50%,
      #6e1b60,
      rgba(0, 0, 0, 0) 60%
    );
    animation: rotate 4s linear infinite;
  }
  .glow {
    overflow: hidden;
    filter: blur(18px); /* Reduced from 22px */
    opacity: 0.4;
    max-height: 78px; /* Reduced from 97px */
    max-width: 128px; /* Reduced from 160px */
  }
  .glow::before {
    content: "";
    z-index: 99;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(60deg);
    position: absolute;
    width: 120px; /* Reduced from 150px */
    height: 600px; /* Reduced from 750px */
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      #000,
      #402fb5 5%,
      #000 38%,
      #000 50%,
      #cf30aa 60%,
      #000 87%
    );
    animation: rotate 4s linear infinite;
  }
  @keyframes rotate {
    100% {
      transform: translate(-50%, -50%) rotate(450deg);
    }
  }
  @keyframes leftright {
    0% {
      transform: translate(0px, 0px);
      opacity: 1;
    }
    49% {
      transform: translate(150px, 0px); /* Reduced from 187px */
      opacity: 0;
    }
    80% {
      transform: translate(-24px, 0px); /* Reduced from -30px */
      opacity: 0;
    }
    100% {
      transform: translate(0px, 0px);
      opacity: 1;
    }
  }
  #filter-icon {
    position: absolute;
    top: 5px; /* Reduced from 6px */
    right: 5px; /* Reduced from 6px */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 101;
    max-height: 24px; /* Reduced from 30px */
    max-width: 40px; /* Reduced from 28px */
    height: 100%;
    width: 100%;
    isolation: isolate;
    overflow: hidden;
    border-radius: 6px; /* Reduced from 8px */
    background: ${(props) => (props.color === "black" ? "linear-gradient(180deg, #161329, black, #1d1b4b)" : "linear-gradient(180deg,rgb(90, 4, 20), rgb(97, 15, 26)  ,rgb(222, 66, 14))")};
    border: 1px solid transparent;
  }
  .filterBorder {
    height: 25px; /* Reduced from 31px */
    width: 24px; /* Reduced from 30px */
    position: absolute;
    overflow: hidden;
    top: 4px; /* Reduced from 5px */
    right: 4px; /* Reduced from 5px */
    border-radius: 6px; /* Reduced from 8px */
  }
  .filterBorder::before {
    content: "";
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
    position: absolute;
    width: 360px; /* Reduced from 450px */
    height: 360px; /* Reduced from 450px */
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.35);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #3d3a4f,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0) 50%,
      #3d3a4f,
      rgba(0, 0, 0, 0) 100%
    );
    animation: rotate 4s linear infinite;
  }
  #main {
    position: relative;
  }
  #search-icon {
    position: absolute;
    left: 12px; /* Reduced from 15px */
    top: 9px; /* Reduced from 11px */
  }
`;


export default FancyButton;
