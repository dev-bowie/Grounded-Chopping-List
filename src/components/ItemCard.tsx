import { motion } from 'framer-motion';
import { useState, useRef, useContext, useEffect } from 'react';
import { MdDeleteForever, MdOutlineDone, MdDragHandle  } from "react-icons/md";
import confetti from 'canvas-confetti';
import { EffectsContext } from '@/context/EffectsContext';

interface ItemCardProps {
	name: string;
	amount: number;
	onRemove: () => void;
	onDone: () => void;
	isDone: boolean;
	note?: string;
	dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export default function ItemCard({ name, amount, onRemove, onDone, isDone, note, dragHandleProps }: ItemCardProps) {
	const [removing, setRemoving] = useState(false);
	const [highlightChange, setHighlightChange] = useState(false);

	const doneButtonRef = useRef<HTMLButtonElement>(null);
	const prevAmountRef = useRef(amount);
	const effectsEnabled = useContext(EffectsContext);

	useEffect(() => {
		if (prevAmountRef.current !== amount && amount > 0) {
			setHighlightChange(true);
			const timeout = setTimeout(() => {
				setHighlightChange(false);
			}, 300);

			prevAmountRef.current = amount;
			return () => clearTimeout(timeout);
		}
	}, [amount]);

	const handleRemove = () => {
		setRemoving(true);
		setTimeout(onRemove, 300); // Delay to allow animation
	}

	const handleDone = () => {
		if (doneButtonRef.current && effectsEnabled) {
			const rect = doneButtonRef.current.getBoundingClientRect();

			const x = (rect.left + rect.width / 2) / window.innerWidth;
			const y = (rect.top + rect.height / 2) / window.innerHeight;

			confetti({
				particleCount: 60,
				spread: 70,
				origin: { x, y },
				disableForReducedMotion: true,
			});
		}

		onDone();
	}

	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.8, y: 10 }}
			animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }}
			exit={{ opacity: 0, x: 200, transition: { duration: 0.2 } }}
			className={`group ${highlightChange ? 'bg-sky-200' : 'bg-sky-950'} text-white rounded-lg p-4 shadow-md flex flex-col justify-between h-full ${
				removing ? 'opacity-0 -translate-x-8' : ''
			} transition-all duration-300 ease-in-out`}
		>
			<div>
				<div className="flex justify-between items-start mb-2">
					<div className={`text-lg font-semibold ${isDone ? 'line-through text-gray-400 opacity-50' : ''}`}>
						{name}
					</div>
					{dragHandleProps && (
						<span
							{...dragHandleProps}
							className="cursor-grab text-gray-400 hover:text-white ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
							title="Drag to reorder"
						>
							<MdDragHandle size={20} />
						</span>
					)}
				</div>

				<div className="flex flex-col text-sm mt-2">
					<div className={`${isDone ? 'line-through text-gray-400 opacity-50' : ''}`}>
						Amount: <span className="font-bold ml-2">{amount}</span>
					</div>
					{note && (
						<div className="text-xs text-gray-300 italic mt-1">
							{note}
						</div>
					)}
				</div>
			</div>

			<div className="flex gap-2 mt-4 self-end">
				<button
					ref={doneButtonRef}
					onClick={handleDone}
					className={`bg-green-700 text-white px-2 py-1 rounded hover:bg-green-600 ${isDone ? 'opacity-50' : ''}`}
					disabled={isDone}
					title="Mark as done"
				>
					<MdOutlineDone className="inline" />
				</button>
				<button
					onClick={handleRemove}
					className={`bg-red-700 text-white px-2 py-1 rounded hover:bg-rose-600 ${isDone ? 'opacity-50' : ''}`}
					title="Remove item"
					disabled={isDone}
				>
					<MdDeleteForever className="inline" />
				</button>
			</div>
		</motion.div>
	);
}