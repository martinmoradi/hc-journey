'use client';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface SaveCharacterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  title?: string;
  existingName?: string;
}

export function SaveCharacterDialog({
  open,
  onOpenChange,
  onSave,
  title = 'Save progress',
  existingName = '',
}: SaveCharacterDialogProps) {
  const [nameInput, setNameInput] = useState(existingName);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameInput.trim()) {
      setError('Character name is required');
      return;
    }

    onSave(nameInput.trim());
    setNameInput('');
    setError('');
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setNameInput(existingName);
      setError('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-linear-to-br from-[#1a1f2e] to-[#0f1419] text-white border border-white/20 backdrop-blur-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="pb-6">
            <DialogTitle className="text-white text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text">
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-3">
              <Label htmlFor="character-name" className="text-gray-300 text-sm font-medium">
                Character Name
              </Label>

              {/* Input with glassmorphism */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-50" />
                <Input
                  id="character-name"
                  name="name"
                  placeholder="Enter character name"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    if (error) setError('');
                  }}
                  className="relative bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-blue-400/50 transition-all duration-300 h-12 text-base"
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg animate-slide-in">
                  <span className="text-red-400 text-sm">⚠️</span>
                  <p className="text-sm text-red-300 font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-3">
            <DialogClose asChild>
              <button
                type="button"
                className="px-6 py-2.5 rounded-lg border-2 border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-300 text-white font-medium"
              >
                Cancel
              </button>
            </DialogClose>

            <button
              type="submit"
              className="group relative px-6 py-2.5 rounded-lg overflow-hidden bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-green-500/30"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <span className="relative text-white font-bold">Save</span>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
