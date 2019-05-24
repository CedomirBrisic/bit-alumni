import React from 'react';

const datumRodjenjaHumanRead = (inputDate) => {
    const months = ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"]
    const date = new Date(inputDate)
    const dd = date.getDate();
    const mm = months[date.getMonth()];
    const yy = date.getFullYear();

    return `${dd}. ${mm} ${yy}.`
}

const showWorkPosition = (studentData) => {
    if (studentData.status == "Na praksi" ||
        studentData.status == "Zaposlen") {
        if (studentData.status == studentData.pozicije[studentData.pozicije.length - 1].status) {
            return studentData.pozicije[studentData.pozicije.length - 1].firma
        }
    }
}


const BitManCard = (props) => {
    return (
        <div className={`bit-man-card col-2 card text-white p-3 mb-5 ${props.data.pol === "alumnus" ? "bg-dark" : "bg-primary"}`}>
            <div className="card-header d-flex p-0">
                {props.data.aktivnaPozicija ? <img src={require('../images/safety-helmet-150913.svg')} alt="working" className="img-fluid w-25 h-50 worker-helmet" /> : null}
                {props.data.pol === "alumnus" ? <img src={require('../images/bitMan.jpg')} alt="bit-man" className="img-fluid w-50 h-100" /> : <img src={require('../images/bitWoman.jpg')} alt="bit-man" className="img-fluid w-50 h-100" />}
                {props.data.saPrakseNaPosao ? <img src={require('../images/award-155595.svg')} alt="ribbon" className="img-fluid w-25 h-50 award-ribbon" /> : null}
                <div className="d-flex flex-column justify-content-center align-items-center w-100">
                    <div>
                        {props.data.status}
                    </div>
                    <div>
                        <b>{showWorkPosition(props.data)}</b>
                    </div>
                </div>
            </div>
            <div className="card-body p-0 mt-3">
                <h5 className="card-title">
                    {props.data.ime} {props.data.prezime}
                </h5>
                <p className="card-text">{props.data.mesto}</p>
                <p className="card-text">{props.data.obrazovanje}</p>
                <p className="card-text">{datumRodjenjaHumanRead(props.data.datumRodjenja)}</p>
            </div>
            <div className="modal-footer w-100 pl-0">
               
                <button data-maticnibroj={props.data.maticniBroj} onClick={props.openStudentDetailsModal} type="button" className={`btn student-details-button ${props.data.pol === "alumnus" ? "btn-primary" : "btn-light"}`}>
                    Detaljnije
              </button>
            </div>
        </div>
    );
}


export default BitManCard;
