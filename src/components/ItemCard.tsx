import { motion } from 'framer-motion';
import { useState, useRef, useContext } from 'react';
import { MdDeleteForever, MdOutlineDoneAll } from "react-icons/md";
import confetti from 'canvas-confetti';
import { EffectsContext } from '../app/layout';

interface ItemCardProps {
	name: string;
	amount: number;
	onRemove: () => void;
	onDone: () => void;
	isDone: boolean;
}

export default function ItemCard({ name, amount, onRemove, onDone, isDone }: ItemCardProps) {
	const [removing, setRemoving] = useState(false);

	const doneButtonRef = useRef<HTMLButtonElement>(null);
	const effectsEnabled = useContext(EffectsContext);

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
				particleCount: 100,
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
			exit={{ opacity:0, x: 200, transition: { duration: 0.2 } }}
			className={`bg-sky-950 text-white rounded-lg p-4 shadow-md flex flex-col justify-between h-full ${
				removing ? 'opacity-0 -translate-x-8' : ''} transition-all duration-300`}
		>
			<div className={`text-lg font-semibold ${isDone ? 'line-through text-gray-400 opacity-50' : ''}`}>
				{name}
			</div>

			<div className='flex items-center justify-between'>
				<div className='text-sm mr-2 inline-flex items-center'>
					Amount: <span className='font-bold ml-2'>{amount}</span>
				</div>
				<div className='flex gap-2'>
					<button
						ref={doneButtonRef}
						onClick={handleDone}
						className='bg-green-700 text-white px-2 py-1 rounded hover:bg-green-600'
						title='Mark as done'
					>
						<MdOutlineDoneAll className='inline' />
					</button>
					<button
						onClick={handleRemove}
						className='bg-red-700 text-white px-2 py-1 rounded hover:bg-rose-600'
						title='Remove item'
					>
						<MdDeleteForever className='inline' />
					</button>
				</div>
			</div>
		</motion.div>
	);
}