import React from "react";
import GraphTDisponivel from "./GraphTemaDisponivel";

const CardTemaDisponivel = () => {
    return (
        <div className="row pt-1 CardTemasDisponiveis">
            <div className="col textCardTemasDisponiveis pl-5">
                <p className="textCardTemasDisponiveisValor">35</p>
                <p className="textCardTemasDisponiveisNome">Temas Disponíveis</p>
            </div>
            <div className="col imgCardTemasDisponiveis">
                {/* <i className="pi pi-file"></i> */}
                <GraphTDisponivel />
            </div>
        </div>
    );
}

export default CardTemaDisponivel;