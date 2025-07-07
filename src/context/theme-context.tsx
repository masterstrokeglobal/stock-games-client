"use client";
import React, { useContext, ChangeEventHandler, useEffect, useState, PropsWithChildren } from "react";

export type Theme = "light" | "dark" | "system";

export const themes: { [key: string]: Theme } = {
    light: "light",
    dark: "dark",
};

interface ThemeContextInterface {
    theme: Theme;
    toggleTheme: ChangeEventHandler<HTMLInputElement>
}

export const ThemeContext = React.createContext<ThemeContextInterface>({
    theme: themes.system,
    toggleTheme: () => { },
});

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error(
            "useTheme must be used inside a ThemeContext.Provider"
        )
    }
    return context.theme
};



const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(themes.system);
    const toggleTheme = (): void => {
        const newTheme = theme == themes.dark ? themes.light : themes.dark;
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const contextValue = {
        theme: theme,
        toggleTheme: toggleTheme,
    };

    useEffect(() => {
        const system: Theme =
            (localStorage.getItem("theme") as Theme) ??
            (window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches
                ? themes.dark
                : themes.light);
        document.documentElement.setAttribute("data-theme", system);
        localStorage.setItem("theme", system);
        setTheme(system);
    }, []);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;