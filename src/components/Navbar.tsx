'use client';

import Link from 'next/link';
import HeaderActions from '@/components/HeaderActions';
import {useState} from "react";
import {HiMenu, HiX} from "react-icons/hi";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className={"flex items-center justify-between gap-2"}>
            <Link href="/" className={"text-lg font-bold hover:opacity-80 transition"}>
                Grounded Chopping List
            </Link>

            {/* Desktop Navigation*/}
            <nav className={"hidden md:flex gap-4 ml-6"}>
                <Link href="/all-items" className={"hover:underline"}>All Items</Link>
                <Link href="/categories" className={"hover:underline"}>Categories</Link>
                <Link href="/progress" className={"hover:underline"}>Progress</Link>
            </nav>

            {/* Mobile Navigation */}
            <button
                className={"sm:hidden ml-auto text-2xl"}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <HiX/> : <HiMenu/>}
            </button>
            {menuOpen && (
                <div
                    className={"absolute top-12 left-0 w-full bg-sky-900 text-white flex flex-col items-center gap-4 py-4 shadow-lg md:hidden z-50 transition"}
                >
                    <Link href="/all-items" onClick={() => setMenuOpen(false)}>All Items</Link>
                    <Link href="/categories" onClick={() => setMenuOpen(false)}>Categories</Link>
                    <Link href="/progress" onClick={() => setMenuOpen(false)}>Progress</Link>

                    <div
                        className={"mt-4 border-t items-center justify-between flex flex-col border-sky-700 pt-3 w-full"}>
                        <HeaderActions/>
                    </div>
                </div>
            )}
        </div>
    )
}