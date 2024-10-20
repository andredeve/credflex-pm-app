import React, { useState, useEffect, useContext } from 'react';
import './credflex.css'; // Importe o CSS com o prefixo 'cred-flex'
import { db } from '../../services/firebaseConection';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'; // Para buscar e salvar no Firestore
import { AuthContext } from "../../contexts/auth";

const CredFlex = () => {
//   const { user } = useContext(AuthContext); // Obtenha o usuário do contexto
  const [alunosData, setAlunosData] = useState([]); // Alunos carregados do Firestore
  const [pelotaoSelecionado, setPelotaoSelecionado] = useState('');
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(0);
  const [quantidadeMassa, setQuantidadeMassa] = useState(0); // Para controle de massa

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

  const adicionarFlexoes = async () => {
    if (alunoSelecionado) {
      const novoSaldo = alunoSelecionado.saldoFlexoes + quantidade;
      const novoHistorico = [
        ...alunoSelecionado.historico,
        { data: new Date().toISOString().split('T')[0], flexoes: quantidade, tipo: 'Adicionadas' },
      ];
      const alunoAtualizado = {
        ...alunoSelecionado,
        saldoFlexoes: novoSaldo,
        historico: novoHistorico,
      };

      // Atualiza no Firestore
      await updateDoc(doc(db, 'UsuarioCredFlex', alunoSelecionado.id), alunoAtualizado);

      // Atualiza o estado local com o novo saldo
      setAlunoSelecionado(alunoAtualizado);
    }
  };

  const pagarFlexoes = async () => {
    if (alunoSelecionado && quantidade <= alunoSelecionado.saldoFlexoes) {
      const novoSaldo = alunoSelecionado.saldoFlexoes - quantidade;
      const novoHistorico = [
        ...alunoSelecionado.historico,
        { data: new Date().toISOString().split('T')[0], flexoes: quantidade, tipo: 'Pagas' },
      ];
      const novoTotalPagas = alunoSelecionado.totalFlexoesPagas + quantidade;
      const alunoAtualizado = {
        ...alunoSelecionado,
        saldoFlexoes: novoSaldo,
        historico: novoHistorico,
        totalFlexoesPagas: novoTotalPagas,
      };

      // Atualiza no Firestore
      await updateDoc(doc(db, 'UsuarioCredFlex', alunoSelecionado.id), alunoAtualizado);

      // Atualiza o estado local
      setAlunoSelecionado(alunoAtualizado);
    }
  };

  // Função para adicionar flexões em massa
  const adicionarFlexoesEmMassa = async () => {
    for (const aluno of alunosData) {
      if (aluno.pelotao === pelotaoSelecionado) {
        const novoSaldo = aluno.saldoFlexoes + quantidadeMassa;
        const novoHistorico = [
          ...aluno.historico,
          { data: new Date().toISOString().split('T')[0], flexoes: quantidadeMassa, tipo: 'Adicionadas' },
        ];
        const alunoAtualizado = {
          ...aluno,
          saldoFlexoes: novoSaldo,
          historico: novoHistorico,
        };

        // Atualiza no Firestore
        await updateDoc(doc(db, 'UsuarioCredFlex', aluno.id), alunoAtualizado);
      }
    }
    // Recarrega os alunos após a atualização
    await carregarAlunosDoFirestore();
  };

  // Função para adicionar flexões para todos os alunos
  const adicionarFlexoesParaTodos = async () => {
    for (const aluno of alunosData) {
      const novoSaldo = aluno.saldoFlexoes + quantidadeMassa;
      const novoHistorico = [
        ...aluno.historico,
        { data: new Date().toISOString().split('T')[0], flexoes: quantidadeMassa, tipo: 'Adicionadas' },
      ];
      const alunoAtualizado = {
        ...aluno,
        saldoFlexoes: novoSaldo,
        historico: novoHistorico,
      };

      // Atualiza no Firestore
      await updateDoc(doc(db, 'UsuarioCredFlex', aluno.id), alunoAtualizado);
    }
    // Recarrega os alunos após a atualização
    await carregarAlunosDoFirestore();
  };

  // Função para pagar flexões em massa
  const pagarFlexoesEmMassa = async () => {
    for (const aluno of alunosData) {
      if (quantidadeMassa <= aluno.saldoFlexoes) {
        const novoSaldo = aluno.saldoFlexoes - quantidadeMassa;
        const novoHistorico = [
          ...aluno.historico,
          { data: new Date().toISOString().split('T')[0], flexoes: quantidadeMassa, tipo: 'Pagas' },
        ];
        const novoTotalPagas = aluno.totalFlexoesPagas + quantidadeMassa;
        const alunoAtualizado = {
          ...aluno,
          saldoFlexoes: novoSaldo,
          historico: novoHistorico,
          totalFlexoesPagas: novoTotalPagas,
        };

        // Atualiza no Firestore
        await updateDoc(doc(db, 'UsuarioCredFlex', aluno.id), alunoAtualizado);
      }
    }
    // Recarrega os alunos após a atualização
    await carregarAlunosDoFirestore();
  };

  // Filtrar alunos pelo pelotão selecionado e ordenar pelo número
  const alunosFiltrados = alunosData
    .filter(aluno => aluno.pelotao === pelotaoSelecionado)
    .sort((a, b) => a.numero - b.numero); // Ordena alunos pelo número em ordem crescente

  return (
    <div className="cred-flex-container">
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

          <h3>Histórico de Flexões</h3>
          <ul>
            {alunoSelecionado.historico.map((item, index) => (
              <li key={index}>
                {item.data}: {item.flexoes} flexões ({item.tipo})
              </li>
            ))}
          </ul>

          {/* Campo para adicionar flexões */}
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            placeholder="Quantidade de Flexões"
          />
          <button onClick={adicionarFlexoes}>Adicionar Flexões</button>

          {/* Campo para pagar flexões */}
          <button onClick={pagarFlexoes}>Pagar Flexões</button>
        </div>
      )}

      {/* Controles de Ação em Massa - apenas se o pelotão estiver selecionado */}
      {pelotaoSelecionado && (
        <div className="cred-flex-mass-actions">
          <h2>Ações em Massa</h2>

          <input
            type="number"
            value={quantidadeMassa}
            onChange={(e) => setQuantidadeMassa(Number(e.target.value))}
            placeholder="Quantidade de Flexões em Massa"
          />
          <button onClick={adicionarFlexoesEmMassa}>Adicionar Flexões para Pelotão</button>
          <button onClick={adicionarFlexoesParaTodos}>Adicionar Flexões para Todos</button>
          <button onClick={pagarFlexoesEmMassa}>Pagar Flexões em Massa</button>
        </div>
      )}
    </div>
  );
};

export default CredFlex;
