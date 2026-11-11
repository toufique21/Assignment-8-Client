"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserInfo from "./UserInfo";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "All Books", href: "/All-Books" },
    { label: "Add Books", href: "/Add-Books" },
    { label: "My Books", href: "/My-Books" },
    { label: "My Borrows", href: "/My-Borrows" },
];

const Navbar = () => {
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(`${href}/`);

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_30px_-24px_rgba(0,0,0,0.8)]">
            <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-3">
                <Link href="/" className="flex flex-col items-center gap-0.5">
                    <span className="flex size-12 items-center justify-center rounded-full bg-brand-foreground p-1.5 shadow-sm ring-1 ring-white/20">
                        <Image
                            src="/5078755.png"
                            alt="BookNook logo"
                            width={50}
                            height={50}
                            className="size-full object-contain"
                        />
                    </span>
                    <p className="text-sm font-bold text-brand-foreground/70">
                        BookNook
                    </p>
                </Link>

                <nav aria-label="Main navigation">
                    <ul className="flex flex-wrap items-center justify-center gap-4 text-xs text-brand-foreground/70">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);

                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(
                                            "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-3 py-1.5 font-medium ring-1 backdrop-blur-md transition-all duration-300",
                                            active
                                                ? "bg-brand-foreground text-brand ring-white/20 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.5)]"
                                                : "bg-white/[0.06] text-brand-foreground/70 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5 hover:text-brand-foreground"
                                        )}
                                    >
                                        {/* Glossy frosted pill on hover */}
                                        {!active && (
                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none absolute inset-0 rounded-full border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.06)_48%,rgba(255,255,255,0.02))] opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_18px_-8px_rgba(0,0,0,0.5)] backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100"
                                            />
                                        )}

                                        {/* Light sweep across the pill */}
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.45)_50%,transparent_75%)] transition-transform duration-700 ease-out group-hover:translate-x-full"
                                        />

                                        <span className="relative z-10">
                                            {link.label}
                                        </span>

                                        {/* Active indicator */}
                                        {active && (
                                            <span
                                                aria-hidden="true"
                                                className="absolute bottom-1 left-1/2 z-10 size-1 -translate-x-1/2 rounded-full bg-brand/70"
                                            />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <UserInfo />
            </div>
        </header>
    );
};

export default Navbar;
