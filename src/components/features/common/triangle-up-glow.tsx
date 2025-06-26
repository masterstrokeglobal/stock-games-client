import * as React from "react";

const TriangleUpGlow = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="20"
        fill="none"
        viewBox="0 0 21 20"
        {...props}
    >
        <g filter="url(#filter0_d_3_90)" shapeRendering="crispEdges">
            <path
                fill="#0BA300"
                fillOpacity="0.7"
                d="M9.459 4.863a1 1 0 0 1 1.732 0l5.314 9.205a1 1 0 0 1-.866 1.5H5.01a1 1 0 0 1-.866-1.5z"
            ></path>
            <path
                stroke="#0BAC00"
                d="M9.892 5.113a.5.5 0 0 1 .866 0l5.314 9.204a.5.5 0 0 1-.433.75H5.01a.5.5 0 0 1-.434-.75z"
            ></path>
        </g>
        <defs>
            <filter
                id="filter0_d_3_90"
                width="20.431"
                height="19.004"
                x="0.109"
                y="0.463"
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
            >
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feColorMatrix
                    in="SourceAlpha"
                    result="hardAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                ></feColorMatrix>
                <feOffset></feOffset>
                <feGaussianBlur stdDeviation="1.95"></feGaussianBlur>
                <feComposite in2="hardAlpha" operator="out"></feComposite>
                <feColorMatrix values="0 0 0 0 0.0571483 0 0 0 0 0.857214 0 0 0 0 0 0 0 0 1 0"></feColorMatrix>
                <feBlend
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_3_90"
                ></feBlend>
                <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow_3_90"
                    result="shape"
                ></feBlend>
            </filter>
        </defs>
    </svg>
);

export default TriangleUpGlow;
