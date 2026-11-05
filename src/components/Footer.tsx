import { HugeiconsIcon } from "@hugeicons/react";
import {
    Call02Icon,
    Facebook01Icon,
    InstagramIcon,
    Linkedin01Icon,
    Location01Icon,
    Mail01Icon,
    NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";

const socialLinks = [
    { label: "Facebook", href: "https://facebook.com", icon: Facebook01Icon },
    { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
    { label: "X", href: "https://x.com", icon: NewTwitterIcon },
    { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin01Icon },
];

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-white/10 bg-brand text-brand-foreground">
            <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr]">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="inline-flex items-center gap-3">
                            <span className="flex size-11 items-center justify-center rounded-xl bg-brand-foreground p-1.5 shadow-sm ring-1 ring-white/20">
                                <Image
                                    src="/5078755.png"
                                    alt="BookNook logo"
                                    width={40}
                                    height={40}
                                    className="size-full object-contain"
                                />
                            </span>
                            <span>
                                <span className="block text-lg font-bold tracking-tight text-brand-foreground">
                                    BookNook
                                </span>
                                <span className="block text-xs font-medium uppercase tracking-[0.18em] text-brand-foreground/60">
                                    Online Book Library
                                </span>
                            </span>
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-brand-foreground/70">
                            Discover, borrow and collect the stories you love. Your
                            next great read is always just a page away.
                        </p>
                    </div>

                    {/* Socials */}
                    <nav aria-label="Footer navigation">
                        <h2 className="text-sm font-semibold text-brand-foreground">
                            Socials
                        </h2>
                        <div className="mt-6 grid items-center gap-2">
                            {socialLinks.map((social) => (
                                <div
                                    key={social.label}
                                    className="flex items-center gap-2"
                                >
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={social.label}
                                        className="flex size-6 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-brand-foreground/70 transition-colors hover:bg-brand-foreground hover:text-brand"
                                    >
                                        <HugeiconsIcon
                                            icon={social.icon}
                                            size={18}
                                            strokeWidth={1.7}
                                        />
                                    </a>
                                    <p className="text-xs text-brand-foreground/60">
                                        {social.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </nav>

                    {/* Contact */}
                    <div>
                        <h2 className="text-sm font-semibold text-brand-foreground">
                            Contact
                        </h2>
                        <address className="mt-4 space-y-3 text-sm not-italic text-brand-foreground/70">
                            <a
                                href="mailto:booknook@booknook.com"
                                className="flex items-start gap-3 transition-colors hover:text-brand-foreground"
                            >
                                <HugeiconsIcon
                                    icon={Mail01Icon}
                                    size={18}
                                    strokeWidth={1.7}
                                    className="mt-0.5 shrink-0"
                                />
                                <span>booknook@booknook.com</span>
                            </a>
                            <a
                                href="tel:+15550123456"
                                className="flex items-start gap-3 transition-colors hover:text-brand-foreground"
                            >
                                <HugeiconsIcon
                                    icon={Call02Icon}
                                    size={18}
                                    strokeWidth={1.7}
                                    className="mt-0.5 shrink-0"
                                />
                                <span>+1 (555) 012-3456</span>
                            </a>
                            <p className="flex items-start gap-3">
                                <HugeiconsIcon
                                    icon={Location01Icon}
                                    size={18}
                                    strokeWidth={1.7}
                                    className="mt-0.5 shrink-0"
                                />
                                <span>
                                    123 Reading Lane,
                                    <br />
                                    Booktown, NY 10001
                                </span>
                            </p>
                        </address>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/10">
                <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-brand-foreground/60 sm:flex-row sm:px-6 lg:px-8">
                    <p>&copy; {year} BookNook. All rights reserved.</p>
                    <p>Read a book every day.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
