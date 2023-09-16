import {React} from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div  className="App_Sidebar d-none d-lg-block">
      <ul>
        <li><Link to="/">Bem vindo!</Link></li>
        <li><Link to="/signupinfo">Continuação do cadastro</Link></li>
        
        <li><Link to="/sgb/trabalhos">Trabalhos</Link></li>
        <li><Link to="">Outra Rota</Link></li>
        <li><Link to="">Outra Rota</Link></li>
        <li><Link to="">Outra Rota</Link></li>
        <li><Link to="">Outra Rota</Link></li>
        <li><Link to="">Outra Rota</Link></li>
        {/* Adicione mais itens de menu conforme necessário */}
      </ul>
    </div>
  );
}

export default Sidebar;
