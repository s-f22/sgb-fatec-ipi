import React from "react";
import GraphProfessores from "./GraphProfessores";


const CardProfessor = () => {
    return (
        <div className="row pt-1 cardProfessor">
            <div className="col textCardprofessor pl-5">
                <p className="textCardprofessorValor">35</p>
                <p className="textCardprofessorNome">Professores</p>
            </div>
            <div className="col imgCardProfessor">
                {/* <i className="pi pi-users"></i> */}
                <GraphProfessores />
            </div>
        </div>
    );
}

export default CardProfessor;