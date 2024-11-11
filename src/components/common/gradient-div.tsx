import React from "react";

interface GradientBorderBoxProps {
    children: React.ReactNode;
    className?: string;
}

const GradientBorderBox: React.FC<GradientBorderBoxProps> = ({ children, className }) => {
    return (
        <div
            className={`p-4  ${className}`}
         
        >
            {children}
        </div>
    );
};

export default GradientBorderBox;
