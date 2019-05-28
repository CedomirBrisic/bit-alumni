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

const calculateCardColor = (props) => {
    if (props.zaposlen){
        return "bg-dark text-light"
    } else if (props.naPraksi){
        return "bg-primary text-light"
    } else {
        return "bg-white text-dark"
    }
}

const calculateCardImage = (props) => {
    if (props.zaposlen){
        return <img src={require('../images/bitMan.jpg')} alt="bit-man" className="img-fluid w-50 h-100" />
    } else if (props.naPraksi) {
        return <img src={require('../images/bitWoman.jpg')} alt="bit-man" className="img-fluid w-50 h-100" />
    }
}


const BitManCard = (props) => {
    return (
        <div className={`bit-man-card col-2 card p-3 mb-5 ${calculateCardColor(props)}`} >
            <div className="card-header d-flex p-0">
                {calculateCardImage(props)}
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
               
                <button data-maticnibroj={props.data.maticniBroj} onClick={props.openStudentDetailsModal} type="button" className="btn student-details-button btn-light">
                    Detaljnije
              </button>
            </div>
        </div>
    );
}


export default BitManCard;
