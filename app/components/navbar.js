"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo.png";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const isActive = (path) => {
        return pathname === path;
    };

    return (
        <header className="bg-white shadow-md fixed top-0 left-0 right-0 h-16 z-50">
            <div className="container mx-auto flex items-center justify-between px-4 h-full">
                <Link href={"/"} onClick={closeMenu}>
                    <Image src={logo} alt="Logo" width={180} height={100} className="w-[120px] sm:w-[140px] lg:w-[180px]" />
                </Link>
                
                <button
                    onClick={toggleMenu}
                    className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {isMenuOpen ? (
                            <path d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                <nav className="hidden lg:block">
                    <ul className="flex items-center gap-2">
                        <li>
                            <Link 
                                href={"/"} 
                                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                                    isActive("/") 
                                        ? "bg-blue-900 text-white font-bold" 
                                        : "text-black hover:bg-blue-900 hover:text-white"
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Beranda
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href={"/monitoring"} 
                                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                                    isActive("/monitoring") 
                                        ? "bg-blue-900 text-white font-bold" 
                                        : "text-black hover:bg-blue-900 hover:text-white"
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Pemantauan Lapangan
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href={"/map"} 
                                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                                    isActive("/map") 
                                        ? "bg-blue-900 text-white font-bold" 
                                        : "text-black hover:bg-blue-900 hover:text-white"
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                Peta Sebaran TPS
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href={"/voting"} 
                                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                                    isActive("/voting") 
                                        ? "bg-blue-900 text-white font-bold" 
                                        : "text-black hover:bg-blue-900 hover:text-white"
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                Rekapitulasi Suara
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href={"/about"} 
                                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                                    isActive("/about") 
                                        ? "bg-blue-900 text-white font-bold" 
                                        : "text-black hover:bg-blue-900 hover:text-white"
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Tentang
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href={"/auth/login"} 
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-bold transition duration-300 text-sm ${
                                    isActive("/auth/login") 
                                        ? "bg-blue-900 text-white border border-blue-900"
                                        : "bg-white text-blue-900 hover:bg-blue-900 hover:text-white border border-blue-900"
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Login Admin
                            </Link>
                        </li>
                    </ul>
                </nav>

                {isMenuOpen && (
                    <nav className="absolute top-full left-0 right-0 bg-white shadow-md lg:hidden">
                        <ul className="flex flex-col">
                            <li>
                                <Link 
                                    href={"/"} 
                                    onClick={closeMenu}
                                    className={`flex items-center gap-2 px-4 py-2.5 ${
                                        isActive("/") 
                                            ? "bg-blue-900 text-white font-bold" 
                                            : "text-black hover:bg-blue-900 hover:text-white"
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={"/monitoring"} 
                                    onClick={closeMenu}
                                    className={`flex items-center gap-2 px-4 py-2.5 ${
                                        isActive("/monitoring") 
                                            ? "bg-blue-900 text-white font-bold" 
                                            : "text-black hover:bg-blue-900 hover:text-white"
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Pemantauan Lapangan
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={"/map"} 
                                    onClick={closeMenu}
                                    className={`flex items-center gap-2 px-4 py-2.5 ${
                                        isActive("/map") 
                                            ? "bg-blue-900 text-white font-bold" 
                                            : "text-black hover:bg-blue-900 hover:text-white"
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    Peta Sebaran TPS
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={"/voting"} 
                                    onClick={closeMenu}
                                    className={`flex items-center gap-2 px-4 py-2.5 ${
                                        isActive("/voting") 
                                            ? "bg-blue-900 text-white font-bold" 
                                            : "text-black hover:bg-blue-900 hover:text-white"
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    Rekapitulasi Suara
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={"/about"} 
                                    onClick={closeMenu}
                                    className={`flex items-center gap-2 px-4 py-2.5 ${
                                        isActive("/about") 
                                            ? "bg-blue-900 text-white font-bold" 
                                            : "text-black hover:bg-blue-900 hover:text-white"
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Tentang
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={"/auth/login"} 
                                    onClick={closeMenu}
                                    className={`flex items-center gap-2 px-4 py-2.5 font-bold transition duration-300 ${
                                        isActive("/auth/login") 
                                            ? "bg-blue-900 text-white border border-blue-900"
                                            : "bg-white text-blue-900 hover:bg-blue-900 hover:text-white border border-blue-900"
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Login Admin
                                </Link>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Navbar;
