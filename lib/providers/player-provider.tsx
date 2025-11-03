'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { PlayerRace, PlayerClass } from '@/lib/types';

interface PlayerState {
  playerRace: PlayerRace | null;
  playerClass: PlayerClass | null;
  charName: string | null;
  currentStepIndex: number;
  isBrowsingMode: boolean; // True when user is browsing without a saved character
}

interface PlayerContextType extends PlayerState {
  setPlayerRace: (race: PlayerRace) => void;
  setPlayerClass: (playerClass: PlayerClass) => void;
  setCharName: (name: string) => void;
  setCurrentStepIndex: (index: number) => void;
  saveCharacter: (characterName: string, currentIndex?: number) => void;
  loadCharacter: (characterName: string) => void;
  getAllCharacters: () => string[];
  deleteCharacter: (characterName: string) => void;
  clearCharacter: () => void;
  createNewCharacter: (
    name: string,
    race: PlayerRace,
    playerClass: PlayerClass,
  ) => void;
  startBrowsing: (race: PlayerRace, playerClass: PlayerClass) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const DEFAULT_STATE: PlayerState = {
  playerRace: null,
  playerClass: null,
  charName: null,
  currentStepIndex: 0,
  isBrowsingMode: false,
};

const CHARACTERS_KEY = 'savedCharacters';
const LAST_CHARACTER_KEY = 'lastCharacter';
const SESSION_CHARACTER_KEY = 'sessionCharacter';

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [playerState, setPlayerState] = useState<PlayerState>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_STATE;
    }
    // Priority: 1. Last saved character, 2. Session character, 3. Default
    try {
      const lastCharName = localStorage.getItem(LAST_CHARACTER_KEY);
      if (lastCharName) {
        const characters = JSON.parse(
          localStorage.getItem(CHARACTERS_KEY) || '{}',
        );
        if (characters[lastCharName]) {
          const savedChar = characters[lastCharName];
          // Ensure currentStepIndex is a valid number
          const stepIndex =
            typeof savedChar.currentStepIndex === 'number'
              ? savedChar.currentStepIndex
              : 0;
          return {
            ...savedChar,
            currentStepIndex: stepIndex,
            isBrowsingMode: false,
          };
        }
      }

      // Check for session character (browse mode)
      const sessionChar = sessionStorage.getItem(SESSION_CHARACTER_KEY);
      if (sessionChar) {
        const parsed = JSON.parse(sessionChar);
        // Ensure currentStepIndex is a valid number
        const stepIndex =
          typeof parsed.currentStepIndex === 'number'
            ? parsed.currentStepIndex
            : 0;
        return {
          ...parsed,
          currentStepIndex: stepIndex,
          isBrowsingMode: true,
        };
      }
    } catch (error) {
      console.error('Error loading character:', error);
    }
    return DEFAULT_STATE;
  });

  const getAllCharactersData = (): Record<string, PlayerState> => {
    if (typeof window === 'undefined') {
      return {};
    }
    try {
      const saved = localStorage.getItem(CHARACTERS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error getting characters:', error);
      return {};
    }
  };

  // Auto-save whenever state changes AND a character name exists AND not in browse mode
  useEffect(() => {
    if (playerState.charName && !playerState.isBrowsingMode) {
      try {
        const characters = getAllCharactersData();
        characters[playerState.charName] = playerState;
        localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
        localStorage.setItem(LAST_CHARACTER_KEY, playerState.charName);
      } catch (error) {
        console.error('Error auto-saving character:', error);
      }
    }

    // Save session character if in browse mode
    if (
      playerState.isBrowsingMode &&
      (playerState.playerRace || playerState.playerClass)
    ) {
      try {
        sessionStorage.setItem(
          SESSION_CHARACTER_KEY,
          JSON.stringify(playerState),
        );
      } catch (error) {
        console.error('Error saving session character:', error);
      }
    }
  }, [playerState]);

  const createNewCharacter = (
    name: string,
    race: PlayerRace,
    playerClass: PlayerClass,
  ) => {
    try {
      const newCharacter: PlayerState = {
        charName: name,
        playerRace: race,
        playerClass: playerClass,
        currentStepIndex: 0,
        isBrowsingMode: false,
      };

      const characters = getAllCharactersData();
      characters[name] = newCharacter;
      localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
      localStorage.setItem(LAST_CHARACTER_KEY, name);
      sessionStorage.removeItem(SESSION_CHARACTER_KEY);

      setPlayerState(newCharacter);
    } catch (error) {
      console.error('Error creating character:', error);
    }
  };

  const startBrowsing = (race: PlayerRace, playerClass: PlayerClass) => {
    const browseState: PlayerState = {
      playerRace: race,
      playerClass: playerClass,
      charName: null,
      currentStepIndex: 0,
      isBrowsingMode: true,
    };
    setPlayerState(browseState);
  };

  const saveCharacter = (characterName: string, currentIndex?: number) => {
    try {
      const characters = getAllCharactersData();
      const stateToSave = {
        ...playerState,
        charName: characterName,
        currentStepIndex: currentIndex ?? playerState.currentStepIndex,
        isBrowsingMode: false,
      };

      characters[characterName] = stateToSave;
      localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
      localStorage.setItem(LAST_CHARACTER_KEY, characterName);
      sessionStorage.removeItem(SESSION_CHARACTER_KEY);

      setPlayerState(stateToSave);
    } catch (error) {
      console.error('Error saving character:', error);
    }
  };

  const loadCharacter = (characterName: string) => {
    try {
      const characters = getAllCharactersData();
      if (characters[characterName]) {
        const loadedChar = {
          ...characters[characterName],
          isBrowsingMode: false,
        };
        setPlayerState(loadedChar);
        localStorage.setItem(LAST_CHARACTER_KEY, characterName);
        sessionStorage.removeItem(SESSION_CHARACTER_KEY);
      } else {
        console.warn(`Character "${characterName}" not found`);
      }
    } catch (error) {
      console.error('Error loading character:', error);
    }
  };

  const getAllCharacters = (): string[] => {
    return Object.keys(getAllCharactersData());
  };

  const deleteCharacter = (characterName: string) => {
    try {
      const characters = getAllCharactersData();
      delete characters[characterName];
      localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));

      if (playerState.charName === characterName) {
        localStorage.removeItem(LAST_CHARACTER_KEY);
        setPlayerState(DEFAULT_STATE);
      }
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  const clearCharacter = () => {
    localStorage.removeItem(LAST_CHARACTER_KEY);
    sessionStorage.removeItem(SESSION_CHARACTER_KEY);
    setPlayerState(DEFAULT_STATE);
  };

  const setPlayerRace = (race: PlayerRace) => {
    setPlayerState((prev) => ({ ...prev, playerRace: race }));
  };

  const setPlayerClass = (playerClass: PlayerClass) => {
    setPlayerState((prev) => ({ ...prev, playerClass }));
  };

  const setCurrentStepIndex = (stepIndex: number) => {
    setPlayerState((prev) => ({ ...prev, currentStepIndex: stepIndex }));
  };

  const setCharName = (name: string) => {
    setPlayerState((prev) => ({ ...prev, charName: name }));
  };

  return (
    <PlayerContext.Provider
      value={{
        ...playerState,
        setPlayerRace,
        setPlayerClass,
        setCharName,
        setCurrentStepIndex,
        saveCharacter,
        loadCharacter,
        getAllCharacters,
        deleteCharacter,
        clearCharacter,
        createNewCharacter,
        startBrowsing,
      }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
