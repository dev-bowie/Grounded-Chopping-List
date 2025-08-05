'use client';

import { useState, useEffect, useRef } from 'react';
import { MdAddCircle, MdDeleteSweep } from "react-icons/md";
import { CiUndo } from "react-icons/ci";
import { PiAxeBold } from "react-icons/pi";
import { AnimatePresence } from 'framer-motion';
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent
} from '@dnd-kit/core';
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ItemCard from './ItemCard';

const LOCAL_STORAGE_KEY = 'choppingListItems';
const MAX_ITEM_AMOUNT = 999;

interface Item {
	name: string;
	amount: number;
	note?: string;
}

export default function ItemList() {
	const [items, setItems] = useState<Item[]>([]);
	const [undoItem, setUndoItem] = useState<Item | null>(null);
	const [predefinedItems, setPredefinedItems] = useState<string[]>([]);
	const [selectedItem, setSelectedItem] = useState('');
	const [amount, setAmount] = useState(1);
	const [note, setNote] = useState('');

	const amountInputRef = useRef<HTMLInputElement>(null);
	const selectRef = useRef<HTMLSelectElement>(null);
	const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const noteInputRef = useRef<HTMLInputElement>(null);

	const sensors = useSensors(useSensor(PointerSensor));

	// Load items from json
	useEffect(() => {
		fetch('/items.json')
			.then(res => res.json())
			.then(data => {
				setPredefinedItems(data);
			})
	}, []);

	// Load items from local storage
	useEffect(() => {
		const savedItems = loadFromLocalStorage();
		if (savedItems.length > 0) {
			setItems(savedItems);
		}
	}, []);

	// Save to local storage whenever items change
	useEffect(() => {
		saveToLocalStorage(items);
	}, [items]);

	// Listen for Slash key to focus the select input
	useEffect(() => {
		const handleSlashKeyDown = (e: KeyboardEvent) => {
			if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'SELECT') {
				e.preventDefault();
				selectRef.current?.focus();
			}
		};

		window.addEventListener('keydown', handleSlashKeyDown);
		return () => window.removeEventListener('keydown', handleSlashKeyDown);
	}, []);

	const saveToLocalStorage = (items: Item[]) => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
	}

	const loadFromLocalStorage = (): Item[] => {
		const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (active.id !== over?.id) {
			const oldIndex = items.findIndex(item => item.name === active.id);
			const newIndex = items.findIndex(item => item.name === over?.id);

			const newItems = arrayMove(items, oldIndex, newIndex);
			setItems(newItems);
			saveToLocalStorage(newItems);
		}
	}

	const handleAddItem = () => {
		if (!selectedItem || amount < 1) return;

		setItems(prev => {
			const existing = prev.find(i => i.name === selectedItem);

			if (existing) {
				return prev.map(item =>
					item.name === selectedItem
						? {
							...item,
							amount: Math.min(item.amount + amount, MAX_ITEM_AMOUNT),
							note: note.trim() || item.note
						 }
						: item
				);
			} else {
				// Otherwise, add a new item
				return [...prev, { name: selectedItem, amount, note: note.trim() || undefined }];
			}
		});

		setAmount(1);
		setSelectedItem('');
		setNote('');
	};

	const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedItem(e.target.value);
		setTimeout(() => {
			amountInputRef.current?.focus();
			amountInputRef.current?.select();
		}, 0); // Focus the amount input after selection
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleAddItem();
	}

	const handleMarkAsDone = (name: string) => {
		setItems(prev => prev.map(entry => (entry.name === name ? { ...entry, amount: 0 } : entry)));

		// Remove the item after 5 seconds
		setTimeout(() => {
			setItems(prev => prev.filter(item => item.name !== name));
		}, 2500);
	};

	const handleRemoveItem = (name: string) => {
		const removedItem = items.find(item => item.name === name);

		if (removedItem) {
			setUndoItem(removedItem);

			const newItems = items.filter(item => item.name !== name);
			setItems(newItems);
			saveToLocalStorage(newItems);

			if (undoTimeoutRef.current) {
				clearTimeout(undoTimeoutRef.current);
			}

			undoTimeoutRef.current = setTimeout(() => {
				setUndoItem(null);
			}, 5000);
		}
	};

	const handleUndo = () => {
		if (!undoItem) return;
		const updatedItems = [...items, undoItem];
		setItems(updatedItems);
		saveToLocalStorage(updatedItems);
		setUndoItem(null);

		if (undoTimeoutRef.current) {
			clearTimeout(undoTimeoutRef.current);
		}
	};

	const handleClearList = () => {
		setItems([]);
	};

	return (
		<div className='w-full mx-auto px-4 py-8'>
			<form onSubmit={handleSubmit} className='flex flex-wrap gap-2 mb-6 items-end'>
				<select
					id='item-select'
					value={selectedItem}
					ref={selectRef}
					onChange={handleItemChange}
					className='border px-2 py-1 rounded bg-sky-900 text-white h-8 w-1/3'
				>
					<option value='' disabled hidden>Select an item</option>
					{predefinedItems.map(item => (
						<option key={item} value={item}>
							{item}
						</option>
					))}
				</select>

				<input
					ref={amountInputRef}
					type='number'
					min={1}
					max={MAX_ITEM_AMOUNT}
					value={amount}
					onChange={e => setAmount(Math.max(1, Math.min(MAX_ITEM_AMOUNT, +e.target.value)))}
					className='border px-2 py-1 rounded bg-sky-900 text-white h-8'
				/>

				<input
					type='text'
					placeholder='Optional note...'
					value={note}
					onChange={e => setNote(e.target.value)}
					ref={noteInputRef}
					className='border px-2 py-1 mx-1 rounded bg-sky-900 text-white h-8'
				/>

				<button
					type='submit'
					onClick={handleAddItem}
					className='bg-blue-700 text-white px-4 py-1 rounded h-8 hover:bg-emerald-700'
				>
					<MdAddCircle className='inline' /> Add
				</button>

				{items.length > 0 && (
					<button
						type='button'
						onClick={handleClearList}
						className='bg-red-700 text-white px-4 py-1 rounded hover:bg-rose-600'
					>
						<MdDeleteSweep className='inline' /> Clear List
					</button>
				)}
			</form>

			<AnimatePresence>
				{items.length === 0 ? (
					<div className='text-center text-gray-400 italic py-8 w-full'>
						<PiAxeBold className='inline mr-3 text-3xl' />
						Your chopping list is empty! Select an item to start!
					</div>
				) : (
					<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
						<SortableContext items={items.map(item => item.name)} strategy={verticalListSortingStrategy}>
							<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
								{items.map(item => (
									<SortableItem
										key={item.name}
										item={item}
										onDone={() => handleMarkAsDone(item.name)}
										onRemove={() => handleRemoveItem(item.name)}
									/>
								))}
							</div>
						</SortableContext>
					</DndContext>

				)}
			</AnimatePresence>

			{undoItem && (
				<div className='fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-amber-200 text-black px- rounded shadow-lg flex items-center gap-4 z-50'>
					<span className='ml-2'>Removed <strong>{undoItem.name}</strong></span>
					<button
						onClick={handleUndo}
						className='bg-blue-500 text-white mx-2 my-3 px-3 py-1 rounded hover:bg-blue-600'
					>
						<CiUndo className='inline' /> Undo
					</button>
				</div>
			)}
		</div>
	);
}

function SortableItem({ item, onDone, onRemove }: {
	item: Item;
	onDone: () => void;
	onRemove: () => void;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition
	} = useSortable({ id: item.name });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style}>
			<ItemCard
				name={item.name}
				amount={item.amount}
				onDone={onDone}
				onRemove={onRemove}
				isDone={item.amount === 0}
				note={item.note}
				dragHandleProps={{ ...attributes, ...listeners }}
			/>
		</div>
	)
}