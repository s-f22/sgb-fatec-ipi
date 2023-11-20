import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import { Button, Modal } from 'react-bootstrap';
// require('dotenv').config({ path: '../../.env' });

const VerifyEmailProfessor = () => {
  const { id_professor, codigo } = useParams();
  const [validationSuccess, setValidationSuccess] = useState(false);
  const navigate = useNavigate();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const failVerifEmail = () => {
    setShowConfirmationModal(false)
    navigate("/sgb");
  }

  useEffect(() => {
    console.log(`https://140.238.186.186:4001/professores/${id_professor}/${codigo}`)
    axios.patch(`https://140.238.186.186:4001/professores/${id_professor}/${codigo}`, { email_inst_verif: true })
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setValidationSuccess(true);

        setTimeout(() => {
          navigate("/sgb");
        }, 3000);
      })
      .catch(error => {
        console.error('Erro ao atualizar o atributo:', error);
        setTimeout(() => {
          setShowConfirmationModal(true)
        }, 5000)
      });
  }, [id_professor, codigo, process.env.MSS_PORTA_PROFESSORES]);

  return (
    <div>
      {validationSuccess ? (
        <div style={{ display: 'flex', flex: 1, height: '100vh', flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
          <h3 style={{ alignSelf: 'center' }}>Validação do e-mail efetuada com sucesso!</h3>
          <p style={{ alignSelf: 'center' }}>Redirecionando...</p>
          <Spinner style={{ alignSelf: 'center' }} animation="grow" />
        </div>
      ) : (
        <div style={{ display: 'flex', flex: 1, height: '100vh', flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
          <p style={{ alignSelf: 'center' }}>Verificando...</p>
          <Spinner style={{ alignSelf: 'center' }} animation="grow" />
          <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
            <Modal.Header >
              <Modal.Title>Parece que algo deu errado...</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Houve algum erro na validação do seu e-mail. Por favor, entre em contato com o {<a href='mailto:suporte_sgb@fatec.sp.gov.br'>suporte_sgb@fatec.sp.gov.br</a>} para verificar.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={failVerifEmail}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  )
};

export default VerifyEmailProfessor;
