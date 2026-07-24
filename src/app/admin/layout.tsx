'use client';

import React, { useEffect, useState } from 'react';
import { PanelLeft, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
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
  const firestore = useFirestore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<User>(userProfileRef, { suppressGlobalError: true });

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
    role: (user.email === 'gandrungmangu@admin.id' || user.email?.includes('admin')) ? 'admin' : 'operator desa',
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
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar md:block">
        <div className="flex h-full max-h-screen flex-col">
          {sidebarContent}
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shrink-0">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 bg-sidebar w-[280px]">
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
        <main className="flex-1 bg-muted/40 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
