import React, { useState, useEffect } from 'react';

const CombatCounter = () => {
  const [hitsRobotA, setHitsRobotA] = useState(0);
  const [hitsRobotB, setHitsRobotB] = useState(0);
  const [teamNameA, setTeamNameA] = useState('Equipe 1');
  const [teamNameB, setTeamNameB] = useState('Equipe 2');
  const [time, setTime] = useState(120);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(interval);
      setIsRunning(false)
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  useEffect(() => {
    let pollingInterval = null;

    const fetchScore = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/score');
        if (response.ok) {
          const data = await response.json();
          setHitsRobotA(data.hitsRobotA);
          setHitsRobotB(data.hitsRobotB);
        } else {
          console.error('Falha ao buscar placar:', await response.text());
        }
      } catch (error) {
        console.error('Erro de rede ao buscar placar:', error);
      }
    };

    pollingInterval = setInterval(fetchScore, 1000); 

    return () => clearInterval(pollingInterval);
  }, []);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const resetGame = async () => {
    // Envia uma requisição para o backend para resetar o placar
    try {
      const response = await fetch('http://localhost:3001/api/reset-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        console.log('Comando de reset enviado para o backend.');
        // O próximo polling atualizará o placar no frontend
      } else {
        console.error('Falha ao enviar comando de reset:', await response.text());
      }
    } catch (error) {
      console.error('Erro de rede ao resetar o placar:', error);
    }

    // Reinicia o timer localmente
    setTime(120);
    setIsRunning(false);
  };

  return (
    <div style={styles.container}>
      {/* Stopwatch */}
      <div style={styles.stopwatchContainer}>
        <h2 style={styles.stopwatchText}>{formatTime(time)}</h2>
        <div style={styles.stopwatchButtons}>
          <button onClick={() => setIsRunning(true)} style={styles.button}>Iniciar</button>
          <button onClick={() => setIsRunning(false)} style={styles.button}>Pausar</button>
          <button onClick={resetGame} style={styles.button}>Reiniciar Jogo</button>
        </div>
      </div>

      <div style={styles.scoreContainer}>
        {/* Robot A Counter */}
        <div style={styles.robotCounter1}>
          <input
            type="text"
            value={teamNameA}
            onChange={(e) => setTeamNameA(e.target.value)}
            style={styles.teamNameInput}
          />
          <h1 style={styles.hitCount}>{hitsRobotA}</h1>
        </div>

        {/* Robot B Counter */}
        <div style={styles.robotCounter2}>
          <input
            type="text"
            value={teamNameB}
            onChange={(e) => setTeamNameB(e.target.value)}
            style={styles.teamNameInput}
          />
          <h1 style={styles.hitCount}>{hitsRobotB}</h1>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100vh',
    backgroundColor: '#282c34',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  stopwatchContainer: {
    marginBottom: '40px',
    textAlign: 'center',
  },
  stopwatchText: {
    fontSize: '4em',
    margin: '0',
  },
  stopwatchButtons: {
    marginTop: '10px',
  },
  scoreContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: '900px',
  },
  robotCounter1: {
    display: 'flex',
    margin: '10px',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#2ecc71',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    minWidth: '300px',
  },
  robotCounter2: {
    display: 'flex',
    margin: '10px',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    minWidth: '300px',
  },
  teamNameInput: {
    fontSize: '1.8em',
    fontWeight: 'bold',
    marginBottom: '20px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid white',
    color: 'white',
    textAlign: 'center',
    padding: '5px',
    width: '80%',
    outline: 'none',
  },
  hitCount: {
    fontSize: '6em',
    margin: '10px 0',
  },
  button: {
    backgroundColor: '#61dafb',
    color: '#282c34',
    border: 'none',
    padding: '12px 25px',
    margin: '8px',
    borderRadius: '5px',
    fontSize: '1.2em',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  },
  buttonHover: {
    backgroundColor: '#4fa3d1',
  },
};

export default CombatCounter