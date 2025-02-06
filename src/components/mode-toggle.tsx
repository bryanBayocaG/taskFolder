import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { useThemeStore } from "@/store"
import { useEffect, useState } from "react"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [isToggle, setToggle] = useState(false)
    const themeSetter = useThemeStore((state) => state.themeSet);
    useEffect(() => {
        themeSetter(theme)
    }, [theme, themeSetter]);
    useEffect(() => {
        if (isToggle) {
            setTheme("light")
        } else {
            setTheme("dark")
        }
    }, [isToggle, setTheme]);

    const hanleToggle = () => {
        if (isToggle) {
            setToggle(false)
        } else {
            setToggle(true)
        }
    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" onClick={hanleToggle}>
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
        </DropdownMenu>
    )
}
