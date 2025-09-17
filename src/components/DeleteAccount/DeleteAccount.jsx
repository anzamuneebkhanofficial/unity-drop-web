/** @format */

'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useDonorAuthStore } from '@/store/auth/auth-donor-store';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'; // adjust path if needed
import { Button } from '@/components/ui/button';

export default function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const { deleteOurself } = useDonorAuthStore();
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deleteOurself();
    if (result) {
      toast.success('Your account has been deleted');
      router.push('/donor/register'); // redirect after deletion
    } else {
      toast.error('Failed to delete account');
    }
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
          Delete Account
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete your account and cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
