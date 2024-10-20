import React, { useState, useEffect } from 'react';
import './credflex.css'; // Importe o CSS com o prefixo 'cred-flex'
import { db } from '../../services/firebaseConection';
import { collection, getDocs } from 'firebase/firestore'; // Para buscar no Firestore
import Logo from '../../assets/Logo.png';
import RankingDevedoresSemana from '../RankingDevedor';

const CredFlexAluno = () => {
  const [alunosData, setAlunosData] = useState([]); // Alunos carregados do Firestore
  const [pelotaoSelecionado, setPelotaoSelecionado] = useState('');
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);

  // Função para buscar os alunos do Firestore ao carregar o componente
  const carregarAlunosDoFirestore = async () => {
    const alunosSnapshot = await getDocs(collection(db, 'UsuarioCredFlex'));
    const alunosList = alunosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAlunosData(alunosList);
  };

  useEffect(() => {
    carregarAlunosDoFirestore(); // Chama ao carregar o componente
  }, []);

  // Filtro para selecionar o pelotão
  const handleSelectPelotao = (e) => {
    setPelotaoSelecionado(e.target.value);
    setAlunoSelecionado(null);  // Reseta o aluno selecionado ao trocar de pelotão
  };

  // Filtro para selecionar o aluno
  const handleSelectAluno = (e) => {
    const aluno = alunosData.find(a => a.id === e.target.value);
    setAlunoSelecionado(aluno);
  };

  // Filtrar alunos pelo pelotão selecionado e ordenar pelo número
  const alunosFiltrados = alunosData
    .filter(aluno => aluno.pelotao === pelotaoSelecionado)
    .sort((a, b) => a.numero - b.numero); // Ordena alunos pelo número em ordem crescente

  return (
    <div className="cred-flex-container">
      {/* Adicionando a logo no topo */}
      <div className="cred-flex-logo">
        <img src={Logo} alt="Logo CredFlex" />
      </div>

      <RankingDevedoresSemana/>

      <h1>CredFlex</h1>

      {/* Filtro de Pelotão */}
      <div className="cred-flex-filters">
        <label htmlFor="pelotaoSelect">Selecione o Pelotão: </label>
        <select id="pelotaoSelect" onChange={handleSelectPelotao}>
          <option value="">Selecione o Pelotão...</option>
          <option value="5° Pelotão">5° Pelotão</option>
          <option value="6° Pelotão">6° Pelotão</option>
          <option value="7° Pelotão">7° Pelotão</option>
        </select>
      </div>

      {/* Select de Alunos (filtrados pelo pelotão e ordenados) */}
      {pelotaoSelecionado && (
        <div className="cred-flex-filters">
          <label htmlFor="alunoSelect">Selecione o Aluno: </label>
          <select id="alunoSelect" onChange={handleSelectAluno}>
            <option value="">Selecione o Aluno...</option>
            {alunosFiltrados.map(aluno => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.warname} - Nº {aluno.numero}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Exibe informações do Aluno Selecionado */}
      {alunoSelecionado && (
        <div className="cred-flex-info">
          <h2>Informações do Aluno</h2>
          <p>Nome: {alunoSelecionado.warname}</p>
          <p>Saldo de Flexões: {alunoSelecionado.saldoFlexoes}</p>
          <p>Total de Flexões Pagas: {alunoSelecionado.totalFlexoesPagas}</p>
          <h3>Histórico de Flexões:</h3>
          <ul>
            {alunoSelecionado.historico.map((entry, index) => (
              <li key={index}>
                {entry.data} - {entry.flexoes} flexões {entry.tipo}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CredFlexAluno;
