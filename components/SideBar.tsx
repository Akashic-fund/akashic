'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from "@/contexts";
import { Grid, Home, LogOut, Settings, Star, BookCheck } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { Button, Switch } from '@/components/ui'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/contexts/SidebarContext'
import { useFeatureFlag, toggleFeatureFlag } from '@/lib/flags'

interface NavItem {
    icon: JSX.Element
    label: string
    href: string
}

export const SideBar = () => {
    const { isOpen, setIsOpen } = useSidebar()
    const pathname = usePathname()
    const { login, logout, authenticated, address } = useAuth()
    const showRounds = useFeatureFlag('ENABLE_ROUNDS')

    console.log("user", address)
    const shortenAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    // Create base nav items
    const baseNavItems: NavItem[] = [
        { icon: <Home className="h-6 w-6" />, label: "Home", href: "/" },
        { icon: <Grid className="h-6 w-6" />, label: "Dashboard", href: "/dashboard" },
        { icon: <Star className="h-6 w-6" />, label: "Collections", href: "/collections" },
    ]

    // Conditionally add Rounds based on feature flag
    const navItems = showRounds
        ? [...baseNavItems, { icon: <BookCheck className="h-6 w-6" />, label: "Rounds", href: "/rounds" }]
        : baseNavItems

    return (
        <div>
            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 flex h-full flex-col border-r bg-white transition-all duration-300 ease-in-out",
                    isOpen ? "w-[240px]" : "w-[70px]"
                )}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <div className={cn("flex items-center justify-center h-[100px] px-4 border-b py-8")}>
                    <div className='flex items-center justify-center w-full'>
                        {isOpen ? (
                            <Image src="/logo-full.png" alt="Logo" width={550} height={60} className="rounded-full" />
                        ) : (
                            <Image src="/logo-icon.png" alt="logo-icon" width={100} height={100} className="rounded" />
                        )}
                    </div>
                </div>
                <nav className="flex-1 space-y-1 p-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center rounded-lg px-1 py-4 text-gray-800 transition-colors hover:bg-gray-100 hover:text-gray-900",
                                isOpen ? "px-4" : "px-[9px]",
                                pathname === item.href && "bg-green-200 text-gray-900 flex-grow"
                            )}
                        >
                            <div className="flex items-center">
                                {item.icon}
                            </div>
                            <span
                                className={cn(
                                    "ml-3 overflow-hidden transition-all duration-300 ease-in-out",
                                    isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>
                <div className="border-t p-2">
                    <Link
                        href="/settings"
                        className={cn(
                            "flex items-center justify-center rounded-lg px-3 py-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900",
                            pathname === "/settings" && "bg-green-200 text-gray-900",
                            isOpen ? "gap-3" : "flex-col items-center"
                        )}
                    >
                        <Settings 
                            className={cn(
                                "h-6 w-6", 
                                isOpen ? "" : "mx-auto"
                            )} 
                        />
                        {isOpen && (
                            <span
                                className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out text-sm text-gray-700",
                                )}
                            >
                                Settings
                            </span>
                        )}
                    </Link>


                    <div className='flex items-center justify-center rounded-lg px-2 py-2 hover:bg-gray-100'>
                        <Image
                            src="https://avatar.vercel.sh/user"
                            alt="User"
                            width={24}
                            height={24}
                            className={cn(
                                "rounded-full",
                                isOpen ? "" : "mx-auto"
                            )}
                        />
                        <div className="flex items-center justify-center rounded-lg ">
                            <span
                                className={cn(
                                    "overflow-hidden text-sm font-medium transition-all duration-300 ease-in-out",
                                    isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
                                )}
                            >
                                {!authenticated ? (
                                    <Button
                                        variant="ghost"
                                        className="font-semibold text-black text-sm"
                                        onClick={login}
                                    >
                                        Connect Wallet
                                    </Button>
                                ) : (
                                    <div className='flex items-center justify-center gap-2 px-2'>
                                        {address ? shortenAddress(address) : 'User'}
                                        <LogOut
                                            className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors cursor-pointer"
                                            onClick={async () => {
                                              await logout();
                                              window.location.href = '/';
                                            }}
                                        />
                                    </div>
                                )}
                            </span>

                        </div>
                    </div>

                </div>
                {isOpen && (
                    <div className="border-t p-2">
                        <div className="text-xs text-gray-500 mb-2 px-2">Developer Options</div>
                        <div className="flex items-center justify-between px-2 py-1">
                            <span className="text-sm">Enable QF Rounds</span>
                            <Switch
                                checked={showRounds}
                                onCheckedChange={() => toggleFeatureFlag('ENABLE_ROUNDS')}
                            />
                        </div>
                    </div>
                )}
            </aside>
        </div>
    )
}
