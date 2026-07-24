"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, type User as FirebaseUser } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, type Firestore } from "firebase/firestore";

const formSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
});

interface LoginFormProps {
  redirectTo?: string;
  defaultValues?: Partial<z.infer<typeof formSchema>>;
  placeholderEmail?: string;
}

export function LoginForm({ redirectTo = '/admin/dashboard', defaultValues, placeholderEmail }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || { email: "", password: "" },
  });

  const ensureUserProfile = async (firebaseUser: FirebaseUser, db: Firestore) => {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const email = firebaseUser.email || '';
    
    let role: 'admin' | 'operator desa' = 'operator desa';
    let name = 'Operator Desa';

    if (email === 'gandrungmangu@admin.id') {
      role = 'admin';
      name = 'Admin Kecamatan';
    } else if (email.endsWith('@admin.id')) {
      const villageName = email.split('@')[0];
      name = `Operator ${villageName.charAt(0).toUpperCase() + villageName.slice(1)}`;
    }

    try {
      const docSnap = await getDoc(userDocRef);
      const userProfile = {
        id: firebaseUser.uid,
        name,
        email,
        role,
        updatedAt: serverTimestamp(),
        updatedBy: firebaseUser.uid,
      };

      if (docSnap.exists()) {
        await updateDoc(userDocRef, userProfile);
      } else {
        await setDoc(userDocRef, {
          ...userProfile,
          createdAt: serverTimestamp(),
          createdBy: firebaseUser.uid,
        });
      }
    } catch (dbError: any) {
        console.warn("Gagal memastikan profil pengguna (tetap melanjutkan login):", dbError);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (!firestore) {
        toast({ variant: "destructive", title: "Kesalahan Konfigurasi", description: "Layanan database tidak tersedia." });
        setIsLoading(false);
        return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      await ensureUserProfile(userCredential.user, firestore);

      toast({
        title: "Login Berhasil",
        description: "Anda akan diarahkan ke dashboard.",
      });
      router.push(redirectTo);

    } catch (error: any) {
      if ((error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential')) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
          await ensureUserProfile(userCredential.user, firestore);

          toast({
            title: "Akun Dibuat & Login Berhasil",
            description: "Anda akan diarahkan ke dashboard.",
          });
          router.push(redirectTo);

        } catch (signUpError: any) {
          toast({
            variant: "destructive",
            title: "Login Gagal",
            description: `Gagal membuat akun. ${signUpError.message || "Silakan coba lagi."}`,
          });
          setIsLoading(false);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Login Gagal",
          description: error.message || "Email atau password salah. Silakan coba lagi.",
        });
        setIsLoading(false);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder={placeholderEmail || 'email@desa.id'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mohon tunggu...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}
