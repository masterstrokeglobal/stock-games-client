"use client";
import { ThemeContext, themes } from "@/context/theme-context";
import { cn } from "@/lib/utils";
import { IconSun, IconMoon } from "@tabler/icons-react";
import React from "react";

const ThemeSwitcher: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <ThemeContext.Consumer>
            {({ theme, toggleTheme }) => (
                <button
                    onClick={() => toggleTheme(theme === themes.dark ? themes.light : themes.dark)}
                    className={cn("relative inline-flex items-center justify-center w-fit h-10 px-2 rounded-full platform-gradient header-inner-shadow transition-all duration-300 hover:scale-105 active:scale-95", className)}
                >
                    <div className={cn("flex items-center gap-2", theme === themes.dark ? "opacity-100 rotate-0 scale-100 w-fit" : "opacity-0 rotate-90 scale-0 w-0")}>
                        
                    <div className="bg-[#D1BDFF] text-white p-0.5 rounded-full border  header-inner-shadow border-[#D1BDFF]">
                            <IconMoon />
                        </div>

                        <span className="text-xs w-12 leading-[1.1]">Dark Mode</span>
                    </div>
                    <div className={cn("flex items-center gap-2", theme === themes.dark ? "opacity-0 -rotate-90 scale-0 w-0" : "opacity-100 rotate-0 scale-100 w-fit")}>
                        <span className="text-xs w-12 leading-[1.1]">Light Mode</span>
                        <div className="bg-primary-game text-white p-0.5 rounded-full border  header-inner-shadow border-[#C2EBFF]">
                            <IconSun />
                        </div>
                    </div>
                </button>
            )}
        </ThemeContext.Consumer>
    );

};

export default ThemeSwitcher;