import type {Metadata} from "next";
import "./globals.css";
import {Geist, Geist_Mono} from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Grounded Chopping List",
    description: "A simple app for managing your chopping list in Grounded"
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <Header/>
        <main className={"flex-grow p-4"}>{children}</main>
        <Footer/>
        </body>
        </html>
    );
}
