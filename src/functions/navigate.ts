// pageAFunctions.ts
import { NavigateFunction } from 'react-router-dom';
import { Dispatch, SetStateAction, ChangeEvent } from 'react';

// Fonction pour gérer le changement de l'input
export const handleInputChange = (
  event: ChangeEvent<HTMLInputElement>,
  setInputValue: Dispatch<SetStateAction<string>>
) => {
  setInputValue(event.target.value);
};

// Fonction pour gérer le changement du radio
export const handleRadioChange = (
  event: ChangeEvent<HTMLInputElement>,
  setRadioValue: Dispatch<SetStateAction<string>>
) => {
  setRadioValue(event.target.value);
};

// Fonction pour naviguer vers PageB avec des données
export const goToPageSolo = (
  navigateToSolo: NavigateFunction,
  inputValue: string
) => {
  navigateToSolo('/solocreation', { state: inputValue });
};

