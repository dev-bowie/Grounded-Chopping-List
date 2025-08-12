import {motion} from 'framer-motion';
import React, {useState, useRef, useContext, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import {MdDeleteForever, MdOutlineDone, MdDragHandle} from "react-icons/md";
import confetti from 'canvas-confetti';
import {EffectsContext} from '@/context/EffectsContext';

const MAX_ITEM_AMOUNT = 999;

interface ItemCardProps {
    name: string;
    amount: number;
    note?: string;
    isDone: boolean;
    onRemove: () => void;
    onDone: () => void;
    onUpdateAmount: (newAmount: number) => void;
    onUpdateNote: (newNote: string) => void;
    dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export default function ItemCard({
                                     name,
                                     amount,
                                     note,
                                     isDone,
                                     onRemove,
                                     onDone,
                                     onUpdateAmount,
                                     onUpdateNote,
                                     dragHandleProps
                                 }: ItemCardProps) {
    const [removing, setRemoving] = useState(false);
    const [editingNote, setEditingNote] = useState(false);
    const [noteDraft, setNoteDraft] = useState(note || "");

    const doneButtonRef = useRef<HTMLButtonElement>(null);
    const isDoneRef = useRef(false);
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
                particleCount: 60,
                spread: 70,
                origin: {x, y},
                disableForReducedMotion: true,
            });
        }

        onDone();
    }

    const handleAmountChange = (delta: number) => {
        const newAmount = Math.max(0, Math.min(amount + delta, MAX_ITEM_AMOUNT));
        onUpdateAmount(newAmount);
    }

    const handleNoteClick = () => {
        setEditingNote(true);
        setNoteDraft(note || "");
    }

    const handleNoteBlur = () => {
        setEditingNote(false);

        setNoteDraft(noteDraft);
    }

    useEffect(() => {
        const isItemDone = amount <= 0;
        if (isItemDone && !isDoneRef.current) {
            isDoneRef.current = true;
            handleDone();
        }

        if (amount > 0) {
            isDoneRef.current = false;
        }
    }, [amount, handleDone]);

    return (
        <motion.div
            layout
            initial={{opacity: 0, scale: 0.8, y: 10}}
            animate={{opacity: 1, scale: 1, y: 0, transition: {type: 'spring', stiffness: 100, damping: 20}}}
            exit={{opacity: 0, x: 200, transition: {duration: 0.2}}}
            className={`group bg-sky-950 text-white rounded-lg p-4 shadow-md flex flex-col justify-between h-full ${
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
							<MdDragHandle size={20}/>
						</span>
                    )}
                </div>

                <div className="flex flex-col text-sm mt-2">
                    {/* Amount */}
                    <div className={`${isDone ? 'line-through text-gray-400 opacity-50' : ''}`}>
                        Amount: <span className="font-bold ml-2">{amount}</span>
                    </div>

                    {/* Quick adjust buttons */}
                    <div className="flex gap-1 mt-1">
                        <button
                            className="bg-gray-700 px-2 py-0.5 rounded hover:bg-gray-500"
                            onClick={() => onUpdateAmount(amount - 100)}
                        >
                            -100
                        </button>
                        <button
                            className="bg-gray-700 px-2 py-0.5 rounded hover:bg-gray-500"
                            onClick={() => onUpdateAmount(amount - 10)}
                        >
                            -10
                        </button>
                        <button
                            className="bg-gray-700 px-2 py-0.5 rounded hover:bg-gray-500"
                            onClick={() => onUpdateAmount(amount - 1)}
                        >
                            -1
                        </button>
                        <button
                            className="bg-gray-700 px-2 py-0.5 rounded hover:bg-gray-500"
                            onClick={() => onUpdateAmount(amount + 1)}
                        >
                            +1
                        </button>
                        <button
                            className="bg-gray-700 px-2 py-0.5 rounded hover:bg-gray-500"
                            onClick={() => onUpdateAmount(amount + 10)}
                        >
                            +10
                        </button>
                        <button
                            className="bg-gray-700 px-2 py-0.5 rounded hover:bg-gray-500"
                            onClick={() => onUpdateAmount(amount + 100)}
                        >
                            +100
                        </button>
                    </div>

                    {/* Editable note */}
                    <div className="text-xs text-gray-300 italic mt-1">
                        {editingNote ? (
                            <textarea
                                className="w-full bg-gray-800 text-white rounded p-1 text-sm"
                                value={noteDraft}
                                onChange={(e) => setNoteDraft(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        setEditingNote(false);
                                        onUpdateNote(noteDraft);
                                    }
                                }}
                                onBlur={() => {
                                    setEditingNote(false);
                                    onUpdateNote(noteDraft);
                                }}
                                autoFocus
                            />
                        ) : (
                            <div
                                className="cursor-pointer hover:underline"
                                onClick={() => {
                                    setEditingNote(true);
                                    setNoteDraft(note || "");
                                }}
                            >
                                {note && note.replace(/\s/g, '').length ? (
                                    <div className="prose prose-sm prose-invert max-w-none">
                                        <ReactMarkdown>
                                            {note}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <span className="italic text-gray-400 hover:underline">Click to add a note</span>
                                )}
                            </div>
                        )}
                    </div>
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
                    <MdOutlineDone className="inline"/>
                </button>
                <button
                    onClick={handleRemove}
                    className={`bg-red-700 text-white px-2 py-1 rounded hover:bg-rose-600 ${isDone ? 'opacity-50' : ''}`}
                    title="Remove item"
                    disabled={isDone}
                >
                    <MdDeleteForever className="inline"/>
                </button>
            </div>
        </motion.div>
    );
}