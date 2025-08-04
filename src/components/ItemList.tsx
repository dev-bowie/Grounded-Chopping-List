'use client';

import { useState, useEffect } from 'react';
import { MdDeleteForever, MdAddCircle, MdDeleteSweep, MdOutlineDoneAll } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';

type ItemEntry = {
	item: string;
	amount: number;
	done?: boolean;
	flash?: boolean; // Optional: for flash effect when adding
};

const LOCAL_STORAGE_KEY = 'choppingListItems';
const MAX_ITEM_AMOUNT = 999;

export default function ItemList() {
	const [ items, setItems ] = useState<ItemEntry[]>([]);
	const [ predefinedItems, setPredefinedItems ] = useState<string[]>([]);
	const [ selectedItem, setSelectedItem ] = useState('');
	const [ amount, setAmount ] = useState(1);

	// Load items from json
	useEffect(() => {
		fetch('/items.json')
			.then(res => res.json())
			.then(data => {
				setPredefinedItems(data);
				setSelectedItem(data[0] || '');
			})
	}, []);

	// Load items from local storage
	useEffect(() => {
		const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (saved) {
			try {
				setItems(JSON.parse(saved));
			} catch (error) {
				console.error('Failed to parse items from local storage:', error);
			}
		}
	}, []);

	// Save to local storage whenever items change
	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
	}, [items]);

	// Flash effect for updated items
	useEffect(() => {
		const timer = setTimeout(() => {
			setItems(prev =>
				prev.map(entry =>
					entry.flash ? { ...entry, flash: false } : entry
				)
			);
		}, 200); // match animation duration

		return () => clearTimeout(timer);
	}, [items]);

	const handleAddItem = () => {
		if (!selectedItem || amount < 1) return;

		setItems(prev => {
			const index = prev.findIndex(entry => entry.item === selectedItem && !entry.done);

			if (index !== -1) {
				// If item already exists, update the amount
				const updated = [...prev];
				const currentAmount = updated[index].amount;
				const newAmount = Math.min(currentAmount + amount, MAX_ITEM_AMOUNT);

				updated[index] = {
					...updated[index],
					amount: newAmount,
				};

				updated[index].flash = true; // Optional: add a flash effect

				return updated;
			} else {
				// Otherwise, add a new item
				return [...prev, { item: selectedItem, amount }];
			}
		});

		setAmount(1);
	};

	const handleUpdateAmount = (index: number, newAmount: number) => {
		setItems(prev => prev.map((entry, i) => (i === index ? { ...entry, amount: newAmount } : entry)));
	}

	const handleMarkAsDone = (index: number) => {
		setItems(prev => prev.map((entry, i) => (i === index ? { ...entry, amount: 0, done: true } : entry)));

		// Remove the item after 5 seconds
		setTimeout(() => {
			setItems(prev => prev.filter((_, i) => i !== index));
		}, 2500);
	};

	const handleRemoveItem = (index: number) => {
		const temp = [...items];
		temp.splice(index, 1);
		setItems(temp);
	};

	return (
		<div className='space-y-4'>
			<div className='flex justify-between items-center'>
				<h2 className='text-xl font-bold'>Chopping List</h2>
				<button
					onClick={() => setItems([])}
					className='bg-red-700 text-white px-4 py-1 rounded hover:bg-rose-600'
					>
					<MdDeleteSweep className='inline font-size-16' /> Clear List
				</button>
			</div>

			<div className='flex gap-2 items-center'>
				<select
					value={selectedItem}
					onChange={e => setSelectedItem(e.target.value)}
					className='border px-2 py-1 mx-1 rounded bg-sky-900 w-1/3'
				>
					{predefinedItems.map(item => (
						<option key={item}>
							{item}
						</option>
					))}
				</select>

				<input
					type='number'
					min={1}
					value={amount}
					onChange={e => setAmount(parseInt(e.target.value))}
					className='border px-2 py-1 mx-1 rounded w-32'
				/>

				<button
					onClick={handleAddItem}
					className='bg-blue-700 text-white px-4 py-1 rounded hover:bg-emerald-700'
				>
					<MdAddCircle className='inline' /> Add
				</button>
			</div>

			<table className='w-full border-collapse table-auto'>
				<thead>
					<tr className='border-b'>
						<th className='text-left p-2'>Item</th>
						<th className='p-2 relative group cursor-help'>
							Amount
							<sup className='ml-1 italic'>i</sup>

							{/* Tooltip for amount info */}
							<div className='absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white text-sm p-2 rounded shadow-lg'>
								The maximum amount for any item is {MAX_ITEM_AMOUNT}.
							</div>
						</th>
						<th className='p-2'>Actions</th>
					</tr>
				</thead>
				<tbody>
					<AnimatePresence>
						{items.map((entry, index) => (
							<motion.tr
								key={entry.item + index}
								layout
								exit={
									entry.done
										? { opacity: 0, scale: 0.3, transition: { duration: 0.2 } } // Pop on done
										: { opacity: 0, x: -100, transition: { duration: 0.2 } }	// Slide out on remove
								}
								initial={{ opacity: 1, y:-10 }}
								animate={{ opacity: 1, y: 0 }}
								className={`border-b ${entry.done ? 'text-gray-400' : ''} ${entry.flash ? 'bg-yellow-50 transition-all duration-200' : ''}`}
							>
								<td className='p-2 w-1/3'>
									<span className={entry.done ? 'line-through' : ''}>{entry.item}</span>
								</td>
								<td className='p-2'>
									{entry.done ? (
										<span className='text-gray-500'>Done 🎉</span>
									) : (
										<input
											type='number'
											min={1}
											value={entry.amount}
											onChange={e => handleUpdateAmount(index, parseInt(e.target.value))}
											className='border px-2 py-1 rounded w-32'
										/>
									)}
								</td>
								<td className='p-2 text-center space-x-2'>
									{!entry.done && (
										<button
											onClick={() => handleMarkAsDone(index)}
											className='bg-green-700 text-white px-2 py-1 rounded hover:bg-green-600'
										>
											<MdOutlineDoneAll className='inline' /> Done
										</button>
									)}
									<button
										onClick={() => handleRemoveItem(index)}
										className='bg-red-700 text-white px-2 py-1 rounded hover:bg-rose-600'
									>
										<MdDeleteForever className='inline' /> Remove
									</button>
								</td>
							</motion.tr>
						))}
					</AnimatePresence>
				</tbody>
			</table>
		</div>
	);
}