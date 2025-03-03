import { useState } from "react";

export default function InputComparer() {
  const [inputValue, setInputValue] = useState("");
  const targetString = "Bonjour";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Tapez ici..."
        className="border p-2 rounded"
      />
      <p className="mt-2">
        {inputValue === targetString ? "Les valeurs correspondent !" : "Les valeurs ne correspondent pas."}
      </p>
    </div>
  );
}
