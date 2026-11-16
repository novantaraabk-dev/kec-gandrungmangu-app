'use client';

import React, { useEffect, useState } from 'react';
import { PanelLeft, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import type { User } from '@/lib/auth';
import { AppHeader } from '@/components/layout/app-header';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SidebarHeader } from '@/components/layout/sidebar-header';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    console.log("AUTH PROJECT:", getAuth().app.options.projectId);
    console.log("DB PROJECT:", getFirestore().app.options.projectId);
  } catch(e) {
    console.error("Gagal mendapatkan ID Proyek Firebase. Kemungkinan Firebase belum diinisialisasi.", e);
  }

  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  
  const { data: userProfile } = useDoc<User>(userProfileRef, { suppressGlobalError: true });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const effectiveProfile: User = userProfile || {
    id: user.uid,
    name: user.email === 'gandrungmangu@admin.id' ? 'Admin Kecamatan' : (user.email?.split('@')[0] || 'Admin'),
    email: user.email || '',
    role: (user.email === 'gandrungmangu@admin.id' || user.email?.includes('admin')) ? 'admin' : 'operator',
    avatarUrl: user.photoURL || '',
  };

  const sidebarContent = (
    <>
      <SidebarHeader homePath="/admin/dashboard"/>
      <ScrollArea className="flex-1">
        <div className="py-2">
          <SidebarNav role={effectiveProfile.role} onLinkClick={() => setIsSheetOpen(false)} />
        </div>
      </ScrollArea>
    </>
  );

  return (
    <div className="admin-theme grid min-h-screen w-full md:grid-cols-[270px_1fr] bg-[radial-gradient(ellipse_at_top_left,_#d4ebe8_0%,_#e6f2f4_45%,_#e3def4_100%)] relative overflow-x-hidden">
      {/* Animated Ambient Mesh Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-36 -left-36 w-[28rem] h-[28rem] bg-teal-300/25 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-violet-300/25 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 left-1/3 w-[26rem] h-[26rem] bg-cyan-200/30 rounded-full blur-3xl"
        />
      </div>

      <div className="hidden border-r border-white/70 bg-white/55 backdrop-blur-2xl shadow-[4px_0_24px_-12px_rgba(15,118,110,0.08)] md:block relative z-10">
        <div className="flex h-full max-h-screen flex-col sticky top-0">
          {sidebarContent}
        </div>
      </div>
      <div className="flex flex-col relative z-10 min-w-0">
        <header className="flex h-16 items-center gap-4 border-b border-white/60 bg-white/35 backdrop-blur-md px-4 md:px-8 shrink-0 sticky top-0 z-20">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden rounded-xl bg-white/70 border-white/80"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="admin-theme flex flex-col p-0 bg-white/85 backdrop-blur-2xl border-r border-white/70 w-[270px]">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu Utama</SheetTitle>
                <SheetDescription>
                  Pilih menu untuk menavigasi ke halaman yang diinginkan.
                </SheetDescription>
              </SheetHeader>
              {sidebarContent}
            </SheetContent>
          </Sheet>
          <AppHeader user={effectiveProfile} />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
