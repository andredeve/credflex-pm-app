import React, { useState, useEffect } from 'react';
import './rankingdevedores.css'; // Estilos para o ranking de pódio
import { db } from '../../services/firebaseConection';
import { collection, getDocs } from 'firebase/firestore'; // Para buscar no Firestore
import Logo from '../../assets/Logo.png'; // Logo da aplicação
import { FaTrophy } from 'react-icons/fa'; // Ícones de troféu

const RankingDevedoresSemana = () => {
  const [devedoresData, setDevedoresData] = useState([]);

  // Função para buscar os alunos do Firestore ao carregar o componente
  const carregarAlunosDevedores = async () => {
    const alunosSnapshot = await getDocs(collection(db, 'UsuarioCredFlex'));
    const alunosList = alunosSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(aluno => aluno.saldoFlexoes > 0) // Filtra apenas os devedores
      .sort((a, b) => b.saldoFlexoes - a.saldoFlexoes); // Ordena devedores pelo saldo de flexões
    setDevedoresData(alunosList.slice(0, 3)); // Limita aos 3 primeiros devedores
  };

  useEffect(() => {
    carregarAlunosDevedores(); // Chama ao carregar o componente
  }, []);

  return (
    <div className="ranking-devedores-container">
      {/* Exibe os 3 primeiros em pódios */}
      <div className="podium-container">
        {devedoresData.map((aluno, index) => (
          <div key={aluno.id} className={`podium-item podium-${index + 1}`}>
            <FaTrophy className={`trophy trophy-${index + 1}`} />
            <p className="podium-position">{index + 1}º Lugar</p>
            <p className="podium-name">{aluno.warname}</p>
            <p className="podium-saldo">{aluno.saldoFlexoes} flexões</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingDevedoresSemana;
