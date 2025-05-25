"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname();

    const menuItems = [
        {
            path: "/superadmin",
            name: "Dashboard Utama",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
            ),
        },
        {
            path: "/superadmin/logistik-superadmin",
            name: "Data Logistik",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                </svg>
            ),
        },
        {
            path: "/superadmin/monitoring-superadmin",
            name: "Pemantauan Lapangan",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            ),
        },
        {
            path: "/superadmin/voting-superadmin",
            name: "Hasil Perolehan Suara",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                </svg>
            ),
        },
    ];

    const handleLinkClick = (e) => {
        if (typeof setIsOpen === 'function') {
            setIsOpen(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" 
                    onClick={() => typeof setIsOpen === 'function' && setIsOpen(false)}
                />
            )}

            <aside className={`fixed top-0 left-0 z-50 h-screen w-64 transition-transform duration-200 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
                bg-white shadow-lg border-gray-200`}
            >
                <div className="h-full flex flex-col">
                    <div className="flex-shrink-0 px-6 py-8 bg-gradient-to-br from-blue-700 to-indigo-900">
                        <h2 className="text-xl font-bold text-white">Selamat Datang!</h2>
                        <p className="text-sm text-blue-100 mt-1">Super Admin Cimahi</p>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all
                                    ${pathname === item.path 
                                        ? "bg-blue-50 text-blue-700" 
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                                onClick={handleLinkClick}
                            >
                                <span className={`${pathname === item.path ? "text-blue-700" : "text-gray-400"}`}>
                                    {item.icon}
                                </span>
                                <span className="ml-3">{item.name}</span>
                                {pathname === item.path && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-700" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">© 2024 CIDAGA. All rights reserved.</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
