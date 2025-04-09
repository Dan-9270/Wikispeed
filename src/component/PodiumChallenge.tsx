import React, { useEffect, useState } from 'react';

const PodiumChallenge = () => {
  const [podium, setPodium] = useState([]);

  useEffect(() => {
    async function chargerUtilisateurs() {
      try {
        const response = await fetch("http://localhost:3000/ranking");
        const users = await response.json();

        console.log("👥 Utilisateurs récupérés :", users); // ✅ Ton log ici
        setPodium(users);
      } catch (error) {
        console.error("❌ Erreur lors du chargement du classement :", error);
      }
    }

    chargerUtilisateurs();
  }, []);

  return (
    <div>
     
    </div>
  );
};

export default PodiumChallenge;
