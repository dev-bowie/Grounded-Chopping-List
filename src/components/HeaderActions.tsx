'use client';

import {TbConfetti, TbConfettiOff} from "react-icons/tb";
import {MdDarkMode, MdLightMode} from "react-icons/md";
import {useState, useEffect} from "react";

export default function HeaderActions() {
    const [darkMode, setDarkMode] = useState(false);
    const [effectsEnabled, setEffectsEnabled] = useState(false);

    useEffect(() => {
        const storedEffects = localStorage.getItem("effectsEnabled");
        if (storedEffects !== null) {
            setEffectsEnabled(storedEffects === 'true');
        }

        const storedTheme = localStorage.getItem("darkMode");
        if (storedTheme !== null) {
            setDarkMode(storedTheme === 'true');
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            localStorage.setItem("darkMode", (!prev).toString());
            document.documentElement.classList.toggle("dark", !prev);
            return !prev;
        });
    };

    const toggleEffects = () => {
        setEffectsEnabled((prev) => {
            localStorage.setItem("effectsEnabled", (!prev).toString());
            return !prev;
        });
    };

    return (
        <div className={"flex items-center gap-2"}>
            <button
                onClick={() => toggleDarkMode()}
                className={"bg-sky-600 px-2 py-1 rounded hover:bg-gray-100"}
                title={"Toggle Dark/Light Mode"}
            >
                {darkMode ? <MdDarkMode /> : <MdLightMode />}
            </button>

            <button
                onClick={() => toggleEffects()}
                className={"bg-sky-600 px-2 py-1 rounded hover:bg-gray-100"}
                title={"Toggle Effects"}
            >
                {effectsEnabled ? <TbConfetti /> : <TbConfettiOff />}
            </button>
        </div>

    )
}