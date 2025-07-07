"use client";
import React, { PropsWithChildren, useContext, useEffect, useState } from "react";


export type Theme = "light" | "dark" | "system";

export const themes: { [key: string]: Theme } = {
    light: "light",
    dark: "dark",
};

interface ThemeContextInterface {
    theme: Theme;
    toggleTheme: (theme: Theme) => void

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


export const useToggleTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error(
            "useToggleTheme must be used inside a ThemeContext.Provider"
        )
    }
    return context.toggleTheme
}

export const useDefaultTheme = (theme: Theme) => {
    const currentTheme = useTheme()
    const toggleTheme = useToggleTheme()
    useEffect(() => {
        if (currentTheme !== theme) {
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
            toggleTheme(theme)
        }
    }, [currentTheme, theme])

    return currentTheme
}



const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(useDefaultTheme(themes.system));

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