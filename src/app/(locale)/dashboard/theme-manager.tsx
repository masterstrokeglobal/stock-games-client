import { COMPANYID } from "@/lib/utils";
import Company from "@/models/company";
import { useGetCompanyById } from "@/react-query/company-queries";
import { useEffect, useMemo } from "react";

const ThemeManager = () => {
    const { data, isSuccess } = useGetCompanyById(COMPANYID.toString());

    const company = useMemo(() => {
        if (isSuccess) {
            return new Company(data?.data);
        }
        return null;
    }, [data, isSuccess]);

    useEffect(() => {
        if (!company) return;
        const theme = company.theme;
        if (!theme) return;

        // Set main theme variables
        document.documentElement.style.setProperty('--primary-game', theme["primary"]);
        document.documentElement.style.setProperty('--secondary-game', theme["secondary"]);
        document.documentElement.style.setProperty('--tertiary', theme["tertiary"]);

        // Set roulette-specific variables
        document.documentElement.style.setProperty('--routelette-black-gradient-start', theme["blackGradientStart"]);
        document.documentElement.style.setProperty('--routelette-black-gradient-end', theme["blackGradientEnd"]);
        document.documentElement.style.setProperty('--routelette-red-gradient-start', theme["redGradientStart"]);
        document.documentElement.style.setProperty('--routelette-red-gradient-end', theme["redGradientEnd"]);
        document.documentElement.style.setProperty('--routelette-border-color', theme["borderColor"]);
        document.documentElement.style.setProperty('--routelette-inner-shadow-color', theme["innerShadowColor"]);

        // Set bet button colors
        document.documentElement.style.setProperty('--bet-button-start', theme["bet-button-start"]);
        document.documentElement.style.setProperty('--bet-button-mid', theme["bet-button-mid"]);
        document.documentElement.style.setProperty('--bet-button-end', theme["bet-button-end"]);
        document.documentElement.style.setProperty('--bet-button-border', theme["bet-button-border"]); 

        // Set main theme variables
        document.documentElement.style.setProperty('--background-game', theme["backgroundGame"]);
        document.documentElement.style.setProperty('--game-text', theme["gameText"]);
        document.documentElement.style.setProperty('--game-text-secondary', theme["gameTextSecondary"]);

        // last winner bg
        document.documentElement.style.setProperty('--last-winner-bg', theme["last-winner-bg"]);

        // rounded-2xl
        document.documentElement.style.setProperty('--radius', theme["radius"]);

        //highlight
        document.documentElement.style.setProperty('--game-header-highlight', theme["gameHeaderHighlight"]);

        // top bar text 
        document.documentElement.style.setProperty('--top-bar-text', theme["top-bar-text"]);

        // Input Field

        document.documentElement.style.setProperty('--input-field', theme["input-field"]);
        document.documentElement.style.setProperty('--input-field-background', theme["input-field-background"]);

        // secondary background
        document.documentElement.style.setProperty('--secondary-background', theme["secondary-background"]);
        document.documentElement.style.setProperty('--chip-color', theme["chip-color"]);

        return () => {
            // Clean up main theme variables
            document.documentElement.style.removeProperty('--primary-game');
            document.documentElement.style.removeProperty('--secondary-game');
            document.documentElement.style.removeProperty('--tertiary');

            // Clean up roulette-specific variables
            document.documentElement.style.removeProperty('--routelette-black-gradient-start');
            document.documentElement.style.removeProperty('--routelette-black-gradient-end');
            document.documentElement.style.removeProperty('--routelette-red-gradient-start');
            document.documentElement.style.removeProperty('--routelette-red-gradient-end');
            document.documentElement.style.removeProperty('--routelette-border-color');
            document.documentElement.style.removeProperty('--routelette-inner-shadow-color');

            // Clean up bet button colors
            document.documentElement.style.removeProperty('--bet-button-start');
            document.documentElement.style.removeProperty('--bet-button-mid');
            document.documentElement.style.removeProperty('--bet-button-end');
            document.documentElement.style.removeProperty('--bet-button-border');

            // Clean up game background
            document.documentElement.style.removeProperty('--background-game');
            document.documentElement.style.removeProperty('--secondary-background');

            // Clean up game header highlight
            document.documentElement.style.removeProperty('--game-header-highlight');
            document.documentElement.style.removeProperty('--game-box-gradient');

            // Clean up top bar text
            document.documentElement.style.removeProperty('--top-bar-text');
            document.documentElement.style.removeProperty('--chip-color');

        };
    }, [company]);

    return null;
};

export default ThemeManager;
