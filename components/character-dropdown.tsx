'use client';

import { DeleteConfirmationDialog } from '@/components/delete-confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getClassImage, getRaceImage } from '@/lib/get-images';
import { PlayerClass, PlayerRace } from '@/lib/types';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CharacterData {
  name: string;
  race: PlayerRace;
  playerClass: PlayerClass;
}

interface CharacterDropdownProps {
  currentCharacter: string | null;
  currentRace: PlayerRace | null;
  currentClass: PlayerClass | null;
  charactersData: CharacterData[];
  onLoadCharacter: (name: string) => void;
  onDeleteCharacter: (name: string) => void;
  onCreateCharacter: () => void;
}

export function CharacterDropdown({
  currentCharacter,
  currentRace,
  currentClass,
  charactersData,
  onLoadCharacter,
  onDeleteCharacter,
  onCreateCharacter,
}: CharacterDropdownProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState('');

  const handleDeleteClick = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCharacterToDelete(name);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (characterToDelete) {
      onDeleteCharacter(characterToDelete);
      setCharacterToDelete('');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-xl">
            <div className="flex items-center gap-2">
              {currentRace && currentClass && (
                <div className="flex items-center">
                  <img src={getRaceImage(currentRace)} alt={currentRace} className="w-5 h-5" />
                  <img src={getClassImage(currentClass)} alt={currentClass} className="w-5 h-5" />
                </div>
              )}
              <span className="text-base font-medium">{currentCharacter || 'Load Character'}</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="start">
          <DropdownMenuLabel>Characters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {charactersData.map((char) => (
              <DropdownMenuItem
                key={char.name}
                className="flex items-center justify-between cursor-pointer"
                onSelect={() => onLoadCharacter(char.name)}
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex items-center">
                    <img src={getRaceImage(char.race)} alt={char.race} className="w-5 h-5" />
                    <img
                      src={getClassImage(char.playerClass)}
                      alt={char.playerClass}
                      className="w-5 h-5"
                    />
                  </div>
                  <span>{char.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => handleDeleteClick(char.name, e)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onSelect={onCreateCharacter}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create New Character</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        characterName={characterToDelete}
      />
    </>
  );
}
