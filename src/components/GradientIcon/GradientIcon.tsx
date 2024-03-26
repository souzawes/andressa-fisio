import { ReactNode } from "react";

interface GradientIconProps {
    icon: ReactNode;
}

const GradientIcon: React.FC<GradientIconProps> = ({ icon }) => {
    
    return(
        <>
            <svg width={0} height={0}>
            <linearGradient id="gradientColors" x1="50%" y1="0%" x2="50%" y2="100%" gradientTransform="rotate(0)">
            <stop offset='0%' stopColor="#0095A1" />          
            <stop offset='100%' stopColor="#F42272" />
            </linearGradient>
            </svg>
            {icon}
        </>
    );
};

export default GradientIcon;