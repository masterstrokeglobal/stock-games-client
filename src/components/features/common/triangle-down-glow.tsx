import * as React from "react";

const TriangleDownGlow = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="20"
        fill="none"
        viewBox="0 0 21 20"
        {...props}
    >
        <g filter="url(#filter0_d_3_92)" shapeRendering="crispEdges">
            <path
                fill="#E30000"
                fillOpacity="0.54"
                d="M11.19 15.136a1 1 0 0 1-1.731 0L4.145 5.93a1 1 0 0 1 .866-1.5h10.628a1 1 0 0 1 .866 1.5z"
            ></path>
            <path
                stroke="red"
                d="M10.758 14.886a.5.5 0 0 1-.866 0L4.577 5.682a.5.5 0 0 1 .434-.75h10.628a.5.5 0 0 1 .433.75z"
            ></path>
        </g>
        <defs>
            <filter
                id="filter0_d_3_92"
                width="20.431"
                height="19.004"
                x="0.109"
                y="0.531"
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
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.0352941 0 0 0 0 0.0352941 0 0 0 1 0"></feColorMatrix>
                <feBlend
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_3_92"
                ></feBlend>
                <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow_3_92"
                    result="shape"
                ></feBlend>
            </filter>
        </defs>
    </svg>
);

export default TriangleDownGlow;
