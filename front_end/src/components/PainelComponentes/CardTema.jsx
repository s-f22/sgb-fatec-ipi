import React from "react";
import GraphTemas from "./GraphTemas";

const CardTema = () => {
    return (
        <div className="row pt-1 cardTema">
            <div className="col textCardTema pl-5">
                <p className="textCardTemaValor">57</p>
                <p className="textCardTemaNome">Temas</p>
            </div>
            <div className="col imgCardTema">
                {/* <i className="pi pi-book"></i> */}
                <GraphTemas />
            </div>
        </div>
    );
}

export default CardTema;