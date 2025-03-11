import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleInputChange, handleRadioChange, goToPageSolo } from './functions/navigate'; // Importer les fonctions

const PageA: React.FC = () => {
  const navigateToSolo = useNavigate();

  const [inputValue, setInputValue] = useState<string>('');
  const [radioValue, setRadioValue] = useState<string>('');

  return (
    <div>
      <h1>Page A</h1>
      
      {/* Champs de formulaire */}
      <input
        type="text"
        value={inputValue}
        onChange={(event) => handleInputChange(event, setInputValue)} 
        placeholder="Entrez une valeur"
      />
      <br />
      
      {/* Radio button */}
      <input
        type="radio"
        id="radio1"
        name="radio"
        value="option1"
        onChange={(event) => handleRadioChange(event, setRadioValue)}
      />
      <label htmlFor="radio1">Option 1</label>
      <br />
      <input
        type="radio"
        id="radio2"
        name="radio"
        value="option2"
        onChange={(event) => handleRadioChange(event, setRadioValue)} 
      />
      <label htmlFor="radio2">Option 2</label>
      <br />

      <button onClick={() => goToPageSolo(navigateToSolo, inputValue, radioValue)}>Aller à la Page B</button>
    </div>
  );
};

export default PageA;