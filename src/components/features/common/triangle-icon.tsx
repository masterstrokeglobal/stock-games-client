import * as React from "react";

const TriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="7"
        fill="none"
        viewBox="0 0 8 7"
        {...props}
    >
        <path
            fill="currentColor"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 5.5 3-4 3 4z"
        ></path>
    </svg>
);

export default TriangleIcon;
