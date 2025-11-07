'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  characterName: string;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  characterName,
}: DeleteConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-linear-to-br from-[#1a1f2e] to-[#0f1419] text-white border border-red-500/30 backdrop-blur-xl max-w-md">
        {/* Warning icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse-slow" />
            <div className="relative w-16 h-16 rounded-full bg-linear-to-br from-red-400/20 to-red-600/20 border-2 border-red-500/40 flex items-center justify-center backdrop-blur-sm">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </div>

        <AlertDialogHeader className="text-center">
          <AlertDialogTitle className="text-2xl font-bold text-white mb-2">
            Delete Character?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300 text-base leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-bold text-white bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
              {characterName}
            </span>
            ?
            <br />
            <span className="text-red-300 text-sm block mt-2">This action cannot be undone.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3 sm:gap-3 mt-6">
          <AlertDialogCancel asChild>
            <button className="flex-1 px-6 py-3 rounded-lg border-2 border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-300 text-white font-medium">
              Cancel
            </button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <button
              onClick={handleConfirm}
              className="group relative flex-1 px-6 py-3 rounded-lg overflow-hidden bg-linear-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <span className="relative text-white font-bold">Delete</span>
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
