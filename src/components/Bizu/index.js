import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import cancaoPmms from '../../assets/cancoes/cancao_pmms.mp3'; // Caminho corrigido

import './bizu.css';

const Bizu = () => {
  const [currentAudio, setCurrentAudio] = useState(null);
  const [showSongs, setShowSongs] = useState(false);
  const [showBugleCalls, setShowBugleCalls] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);
  const [showLyrics, setShowLyrics] = useState({});

  // Lista de canções com letras
  const songs = [
    { 
      name: 'Canção da PMMS', 
      src: cancaoPmms, 
      description: '',
      lyrics: `Nós somos força aguerrida
Tropa atenta do povo a serviço
Sentinela avançada e alerta
Braço forte no garbo e no viço

Corumbá, Campo Grande, Nioaque
Dourados, Coimbra, Antônio João
Estou perfilado em sentido
Para glória da Corporação

Mato Grosso do Sul, meu estado
Eldorado da federação
Do governo acatamos as ordens
Provendo paz, afirmação

Força altiva de grandes heróis
Nas cidades, nos campos e rios

Policiais Militares somos prontos ao povo servir
Por um melhor porvir`
    },
    { 
      name: 'Canção da Infantaria', 
      src: 'https://www.traditioninaction.org/Cultural/Music_P_files/P092_Inf.mp3', 
      description: '',
      lyrics: `Nós somos estes infantes
Cujos peitos amantes
Nunca temem lutar
Vivemos, morremos
Para o Brasil nos consagrar!

Nós, peitos nunca vencidos
De valor, desmedidos
No fragor da disputa
Mostremos
Que em nossa Pátria temos
Valor imenso
No intenso da luta

És a nobre Infantaria
Das armas, a rainha
Por ti daria
A vida minha
E a glória prometida
Nos campos de batalha
Está contigo ante o inimigo
Pelo fogo da metralha

És a eterna majestade
Nas linhas combatentes
És a entidade dos mais valentes
Quando o toque da vitória
Marcar nossa alegria
Eu cantarei, eu gritarei
És a nobre Infantaria

Brasil, te darei com amor
Toda a seiva e vigor
Que em meu peito se encerra
Fuzil
Servil
Meu nobre amigo para a guerra

Ó, meu amado pendão
Sagrado pavilhão
Que a glória conduz
Com luz sublime amor se exprime
Se do alto me falas
Todo roto por balas

És a nobre Infantaria
Das armas, a rainha
Por ti daria a vida minha
E a glória prometida
Nos campos de batalha
Está contigo ante o inimigo
Pelo fogo da metralha

És a eterna majestade
Nas linhas combatentes
És a entidade dos mais valentes
Quando o toque da vitória
Marcar nossa alegria
Eu cantarei, eu gritarei
És a nobre Infantaria`
    },
  ];

  const bugleCalls = [
    { 
      name: 'Sentido', 
      src: 'https://cpmlondrina.com.br/wp-content/uploads/2018/06/48-sentido.mp3?_=48', 
      gif: 'https://media.giphy.com/media/sentido-gif.gif',
      description: 'Este toque é utilizado para chamar a tropa à posição de sentido, indicando atenção e prontidão.' 
    },
    { 
      name: 'Descansar', 
      src: 'https://cpmlondrina.com.br/wp-content/uploads/2018/06/20-descansar.mp3?_=48', 
      gif: 'https://media.giphy.com/media/descansar-gif.gif',
      description: 'O toque de descansar é dado para relaxar a posição de sentido e aguardar novas ordens.' 
    },
    { 
      name: 'Cobrir', 
      src: 'https://cpmlondrina.com.br/wp-content/uploads/2018/06/16-cobrir.mp3?_=48', 
      gif: 'https://media.giphy.com/media/cobrir-gif.gif',
      description: 'Este toque é usado para alinhar a tropa, garantindo que todos estejam corretamente posicionados.' 
    },
    { 
      name: 'Firme', 
      src: 'https://cpmlondrina.com.br/wp-content/uploads/2018/06/28-firme.mp3?_=48', 
      gif: 'https://media.giphy.com/media/firme-gif.gif',
      description: 'O toque de firme indica que a tropa deve manter a posição estática com disciplina.' 
    },
  ];

  const presentationList = [
    { name: 'Xerife', description: 'Permissão Senhor, Aluno Soldado PM, NÚMERO, NOME, Xerife do PELOTÃO NÚMERO DO CFSD do BATALHÃO da CIDADE, NÚMERO DO CPA, apresento o PELOTÃO com/sem alteração a vossa disposição.; ' },
    { name: 'Aluno', description: 'Aluno Soldado PM Número, Nome de Guerra'},
  ];

  const playAudio = (src) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = new Audio(src);
    setCurrentAudio(audio);
    audio.play();
  };

  const toggleLyrics = (index) => {
    setShowLyrics((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const formatLyrics = (lyrics) => {
    const words = lyrics.split(' '); // Quebra a letra em palavras
    const lines = [];
    for (let i = 0; i < words.length; i += 4) {
      lines.push(words.slice(i, i + 4).join(' ')); // Junta até 4 palavras por linha
    }

    const paragraphs = [];
    for (let i = 0; i < lines.length; i += 4) {
      paragraphs.push(lines.slice(i, i + 4).join('\n')); // Agrupa as linhas em parágrafos de 4 linhas
    }

    return paragraphs;
  };

  return (
    <div className="corneta-container">
      <h1 className="corneta-title" onClick={() => setShowPresentation(!showPresentation)}>
        Apresentações {showPresentation ? '-' : '+'}
      </h1>
      {showPresentation && (
        <ul className="corneta-list">
          {presentationList.map((presentation, index) => (
            <li key={index}>
              <h2>{presentation.name}</h2>
              <p>{presentation.description}</p>
            </li>
          ))}
        </ul>
      )}

      <h1 className="corneta-title" onClick={() => setShowSongs(!showSongs)}>
        Canções {showSongs ? '-' : '+'}
      </h1>
      {showSongs && (
        <ul className="corneta-list">
          {songs.map((song, index) => (
            <li key={index}>
              <button className="corneta-button" onClick={() => playAudio(song.src)}>
                <FontAwesomeIcon icon={faPlay} />
                {song.name}
              </button>
              <p className="corneta-description">{song.description}</p>
              <button className="toggle-lyrics" onClick={() => toggleLyrics(index)}>
                <FontAwesomeIcon icon={showLyrics[index] ? 'faMinus' : 'faPlus'} />
                {showLyrics[index] ? 'Fechar letras' : 'Abrir letras'}
              </button>
              {showLyrics[index] && (
                <div className="corneta-lyrics">
                  {formatLyrics(song.lyrics).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <h1 className="corneta-title" onClick={() => setShowBugleCalls(!showBugleCalls)}>
        Toques de Corneta {showBugleCalls ? '-' : '+'}
      </h1>
      {showBugleCalls && (
        <ul className="corneta-list">
          {bugleCalls.map((call, index) => (
            <li key={index}>
              <button className="corneta-button" onClick={() => playAudio(call.src)}>
                <FontAwesomeIcon icon={faPlay} />
                {call.name}
              </button>
              <div className="gif-container">
                <img src={call.gif} alt={`${call.name} movement`} />
              </div>
              <p className="corneta-description">{call.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bizu;
