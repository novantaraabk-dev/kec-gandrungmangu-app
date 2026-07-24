'use client';
import { useState } from 'react';
import { AppLogo } from '@/components/layout/app-logo';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAppSettings } from '@/lib/app-settings';
import Link from 'next/link';

const navLinks = [
    { href: '#', label: 'Beranda' },
    { href: '#', label: 'Profil Desa' },
    { href: '#', label: 'Layanan' },
    { href: '#', label: 'Kontak' },
];

export function LandingNavbar() {
    const { logoUrl } = useAppSettings();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
                <Link href="/" passHref>
                    <div className="flex items-center cursor-pointer">
                        <AppLogo logoUrl={logoUrl} />
                    </div>
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    {navLinks.map(link => (
                         <Link key={link.label} href={link.href} passHref>
                            <span className="text-foreground/80 hover:text-primary transition-colors cursor-pointer">{link.label}</span>
                         </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <Button variant="outline" className="hidden md:flex" asChild>
                       <Link href="/login">Login Admin</Link>
                    </Button>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                        <span className="sr-only">Buka menu</span>
                    </Button>
                </div>
            </div>

             {/* Mobile Menu Panel */}
             {isMenuOpen && (
                <div className="md:hidden border-t">
                    <nav className="flex flex-col gap-4 p-4">
                         {navLinks.map(link => (
                             <Link key={link.label} href={link.href} passHref>
                                <span className="text-foreground/80 hover:text-primary transition-colors cursor-pointer" onClick={() => setIsMenuOpen(false)}>{link.label}</span>
                             </Link>
                        ))}
                         <Button variant="outline" asChild>
                           <Link href="/login">Login Admin</Link>
                        </Button>
                    </nav>
                </div>
             )}
        </header>
    );
}

    