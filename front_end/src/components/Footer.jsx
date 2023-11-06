import React from 'react'
import "../index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';


const Footer = () => {
  return (
    
    <div style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: '#333', color: '#fff' }}>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontWeight: 'bold' }}>Fatec Ipiranga - Pastor Enéas Tognini</div>
          <div>Rua Frei João, 59 – Ipiranga, São Paulo – SP Cep: 04280-130</div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <div>Telefone: (11) 5061-5462</div>
          <div>E-mail: <a href="mailto:contato@fatecipiranga.edu.br">contato@fatecipiranga.edu.br</a></div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '20px' }}>
          <a href="#" style={{ marginRight: '10px' }}>Twitter</a>
          <a href="#" style={{ marginRight: '10px' }}>Facebook</a>
          <a href="#">Instagram</a>
        </div>
        <div style={{ backgroundColor: '#444', padding: '10px' }}>
          <p style={{ margin: '0' }}>© 2023 SGB Fatec Ipiranga</p>
        </div>
      </div>
    </div>
  
  
   
  );
}

export default Footer