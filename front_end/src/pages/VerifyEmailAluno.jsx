import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// require('dotenv').config({ path: '../../.env' });

const VerifyEmailAluno = () => {
  const { idAluno } = useParams();

  useEffect(() => {
    axios.patch(`http://localhost:${process.env.MSS_PORTA_ALUNOS}/alunos/${idAluno}`, { emailInstVerif: true })
      .then(response => {
        console.log('Resposta do servidor:', response.data);
      })
      .catch(error => {
        console.error('Erro ao atualizar o atributo:', error);
      });
  }, [idAluno]);

  return <div>Aguarde, validando o seu cadastro...</div>;
};

export default VerifyEmailAluno;
