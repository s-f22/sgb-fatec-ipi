import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { idUsuario } = useParams();

  useEffect(() => {
    axios.patch(`http://localhost:4000/alunos/${idUsuario}`, { emailInstVerif: true })
      .then(response => {
        console.log('Resposta do servidor:', response.data);
      })
      .catch(error => {
        console.error('Erro ao atualizar o atributo:', error);
      });
  }, [idUsuario]);

  return <div>Aguarde, validando o seu cadastro...</div>;
};

export default VerifyEmail;
