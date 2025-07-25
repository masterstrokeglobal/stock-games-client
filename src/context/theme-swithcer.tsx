"use client";
import { ThemeContext, themes } from "@/context/theme-context";
import { cn } from "@/lib/utils";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";

const ThemeSwitcher: React.FC<{ className?: string }> = ({ className }) => {
    const t = useTranslations("platform.navbar");
    return (
        <ThemeContext.Consumer>
            {({ theme, toggleTheme }) => (
                <button
                    onClick={() => toggleTheme(theme === themes.dark ? themes.light : themes.dark)}
                    className={cn("relative inline-flex items-center md:aspect-auto aspect-square justify-center w-fit md:h-10 h-8 md:px-2 px-1 rounded-full platform-gradient header-inner-shadow transition-all duration-300", className)}
                >
                    <div className={cn("flex items-center gap-2", theme === themes.dark ? "opacity-100 rotate-0 scale-100 w-fit" : "opacity-0 rotate-90 scale-0 w-0")}>
                    <div className="bg-[#D1BDFF] text-white p-0.5 rounded-full border  header-inner-shadow border-[#D1BDFF]">
                            <IconMoon className="md:size-5 size-4" />
                        </div>

                        <span className="text-xs w-12 leading-[1.1] md:block hidden">{t("dark-mode")}</span>
                    </div>
                    <div className={cn("flex items-center gap-2", theme === themes.dark ? "opacity-0 -rotate-90 scale-0 w-0" : "opacity-100 rotate-0 scale-100 w-fit")}>
                        <span className="text-xs w-12 leading-[1.1] md:block hidden">{t("light-mode")}</span>
                        <div className="bg-primary-game text-white p-0.5 rounded-full border  header-inner-shadow border-[#C2EBFF]">
                            <IconSun className="md:size-5 size-4" />
                        </div>
                    </div>
                </button>
            )}
        </ThemeContext.Consumer>
    );

};

export default ThemeSwitcher;