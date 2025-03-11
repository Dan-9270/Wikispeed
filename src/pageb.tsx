import React from "react";
import { useLocation } from "react-router-dom";

const PageB: React.FC = () => {
  const location = useLocation();
  const formData = location.state;

  return (
    <div>
      <h1>Page B</h1>
      <p>Nombre d'articles : {formData.nombreArticles}</p>
      <p>Artefacts : {formData.artefacts}</p>
      <p>Temps : {formData.temps}</p>
      <p>Mots aléatoires : {formData.randomMots}</p>
      <p>Choix de mots : {formData.choixMots}</p>
    </div>
  );
};

export default PageB;