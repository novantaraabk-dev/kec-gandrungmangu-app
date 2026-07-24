import { PlaceHolderImages } from "./placeholder-images";

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator';
  avatarUrl: string;
};

// This is a mock function. In a real app, you'd get this from Firebase Auth
// and a 'users' collection in Firestore to get the role.
export async function getUser(): Promise<User> {
  const avatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  // This mock should reflect the primary admin user.
  return {
    id: '1', // This ID is mock, will be replaced by real auth UID
    name: 'Admin Kecamatan',
    email: 'gandrungmanu@admin.id',
    role: 'admin', 
    avatarUrl: avatar?.imageUrl || '',
  };
}
