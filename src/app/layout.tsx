'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { useState, createContext } from "react";
import { TbConfetti, TbConfettiOff } from "react-icons/tb"
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const EffectsContext = createContext(true);

const metadata: Metadata = {
	title: "Grounded Chopping List",
	description: "A simple app for managing your chopping list in Grounded"
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [effectsEnabled, setEffectsEnabled] = useState(true);

	const toggleEffects = () => {
		setEffectsEnabled(prev => {
			localStorage.setItem("effectsEnabled", (!prev).toString());
			return !prev;
		});
	};

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<button
					onClick={toggleEffects}
					className={`toggle-btn ${effectsEnabled ? 'toggled' : ''} fixed top-6 right-6 bg-sky-800 px-3 py-1 rounded shadow hover:bg-sky-950 z-50`}
				>
					<div className='thumb'></div>
					<div className='icon'>
						{effectsEnabled ? <TbConfetti /> : <TbConfettiOff />}
					</div>
				</button>
				<EffectsContext value={effectsEnabled}>
					{children}
				</EffectsContext>
			</body>
		</html>
	);
}
