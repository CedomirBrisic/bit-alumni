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
    if (props.zaposlen) {
        return "working-card text-light"
    } else if (props.naPraksi) {
        return "internship-card text-light"
    } else {
        return "bg-white text-dark"
    }
}

const calculateCardImage = (props) => {
    if (props.zaposlen) {
        return <img src={require('../images/bitMan.jpg')} alt="bit-man" className="img-fluid w-50" />
    } else if (props.naPraksi) {
        return <img src={require('../images/bitWoman.jpg')} alt="bit-man" className="img-fluid w-50" />
    }
}


const BitManCard = (props) => {
    return (
        <div className={`col-2 card ${calculateCardColor(props)} ${props.zaposlen || props.naPraksi ? "bit-man-card" : "bit-man-card-student-list-view-borders"}`} >
                <div className={`card-header d-flex d-flex justify-content-center align-items-center ${props.zaposlen || props.naPraksi ? "" : "bit-man-card-student-list-view"}`}>
                    {calculateCardImage(props)}
                    <div className="d-flex flex-column justify-content-center align-items-center w-100">
                        <div>
                            <i>{props.data.status}</i>
                        </div>
                        <div>
                            <h5 className="bitman-card-header-title">{showWorkPosition(props.data)}</h5>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <h5 className="card-title">
                        {props.data.ime} {props.data.prezime}
                    </h5>
                    <p className="card-text">{props.data.mesto}</p>
                    <p className="card-text"><i>{props.data.obrazovanje}</i></p>
                    <p className="card-text">{datumRodjenjaHumanRead(props.data.datumRodjenja)}</p>
                </div>
                <div className="modal-footer w-100">

                    <button data-maticnibroj={props.data.maticniBroj} onClick={props.openStudentDetailsModal} type="button" className="btn student-details-button btn-light">
                        Otvori
                    </button>
                </div>
        </div>
    );
}


export default BitManCard;
