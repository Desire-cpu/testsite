
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    if (theme === "dark") {
      return <Moon className="h-4 w-4" />;
    }
    return <Sun className="h-4 w-4" />;
  };

  const getLabel = () => {
    if (theme === "light") return "Light";
    if (theme === "dark") return "Dark";
    return "System";
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="btn-modern relative overflow-hidden"
      title={`Switch to ${theme === "light" ? "dark" : theme === "dark" ? "system" : "light"} mode`}
    >
      <div className="flex items-center space-x-2">
        {getIcon()}
        <span className="hidden sm:inline">{getLabel()}</span>
      </div>
    </Button>
  );
}
