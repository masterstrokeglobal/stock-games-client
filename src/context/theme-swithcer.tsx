"use client";
import { ThemeContext, themes } from "@/context/theme-context";
import { IconSun, IconMoon } from "@tabler/icons-react";
import React from "react";

const ThemeSwitcher: React.FC = () => {
  return (
    <ThemeContext.Consumer>
      {({ theme, toggleTheme }) => (
        <label className="swap swap-rotate">
          {/* this hidden checkbox controls the state */}
          <input
            type="checkbox"
            className="theme-controller hidden"
            value={themes.dark}
            checked={theme === themes.dark}
            onChange={toggleTheme}
          />
          {/* sun icon */}
          <IconSun className="swap-on h-10 w-10 fill-current"/>

          {/* moon icon */}
          <IconMoon className="swap-off h-10 w-10 fill-current"/>
        </label>
      )}
    </ThemeContext.Consumer>
  );
};

export default ThemeSwitcher;