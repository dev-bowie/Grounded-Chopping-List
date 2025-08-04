'use client';

import { useState, useEffect } from 'react';
import { MdDeleteForever, MdAddCircle, MdDeleteSweep } from "react-icons/md";

type ItemEntry = {
	item: string;
	amount: number;
};

const LOCAL_STORAGE_KEY = 'choppingListItems';

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

	const handleAddItem = () => {
		if (!selectedItem || amount < 1) return;
		setItems(prev => [...prev, { item: selectedItem, amount }]);
		setAmount(1);
	};

	const handleUpdateAmount = (index: number, newAmount: number) => {
		setItems(prev => prev.map((entry, i) => (i === index ? { ...entry, amount: newAmount } : entry)));
	}

	const handleRemoveItem = (index: number) => {
		setItems(prev => prev.filter((_, i) => i !== index));
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
						<th className='text-left p-2'>Amount</th>
						<th className='p-2'>Actions</th>
					</tr>
				</thead>
				<tbody>
					{items.map((entry, index) => (
						<tr key={index} className='border-b'>
							<td className='p-2 w-1/3'>{entry.item}</td>
							<td className='p-2'>
								<input
									type='number'
									min={1}
									value={entry.amount}
									onChange={e => handleUpdateAmount(index, parseInt(e.target.value))}
									className='border px-2 py-1 rounded w-32'
								/>
							</td>
							<td className='p-2 text-center'>
								<button
									onClick={() => handleRemoveItem(index)}
									className='bg-red-700 text-white px-2 py-1 rounded hover:bg-rose-600'
								>
									<MdDeleteForever className='inline' /> Remove
								</button>
							</td>
						</tr>
					))}
					{items.length === 0 && (
						<tr>
							<td colSpan={3} className='p-2 text-center text-gray-500'>No items added yet.</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}