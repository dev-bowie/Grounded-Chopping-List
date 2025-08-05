'use client';

import { useState } from "react";
import { EffectsContext } from "@/context/EffectsContext";
import { TbConfetti, TbConfettiOff } from "react-icons/tb"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
	const [effectsEnabled, setEffectsEnabled] = useState(true);

	const toggleEffects = () => {
		setEffectsEnabled(prev => {
			localStorage.setItem("effectsEnabled", (!prev).toString());
			return !prev;
		});
	};

	return (
		<EffectsContext value={effectsEnabled}>
			<button
				onClick={toggleEffects}
				className={`toggle-btn ${effectsEnabled ? 'toggled' : ''} fixed top-6 right-6 bg-sky-800 px-3 py-1 rounded shadow hover:bg-sky-950 z-50`}
			>
				<div className='thumb'></div>
				<div className='icon'>
					{effectsEnabled ? <TbConfetti /> : <TbConfettiOff />}
				</div>
			</button>
			{children}
		</EffectsContext>
	)
}