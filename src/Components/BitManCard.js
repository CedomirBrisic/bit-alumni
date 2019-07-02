import React, { Component } from 'react';


class BitManCard extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    calculateStatus = () => {
        const status = this.props.data.status;
        const pol = this.props.data.pol;
        let output = null;
        if (pol === "alumnus"){
            output = status
        } else {
            if (status === "Zaposlen"){
                output = "Zaposlena"
            } else if (status === "Odustao"){
                output = "Odustala"
            } else {
                output = status
            }
        }
        return <i>{output}</i>;
    }


    showWorkPosition = (studentData) => {
        if (studentData.status === "Na praksi" ||
            studentData.status === "Zaposlen") {
            if (studentData.pozicije && studentData.status === studentData.pozicije[studentData.pozicije.length - 1].status) {
                return studentData.pozicije[studentData.pozicije.length - 1].firma
            }
        }
    }

    calculateCardColor = () => {
        if (this.props.zaposlen) {
            return "bg-info text-light"
        } else if (this.props.naPraksi) {
            return "bg-primary text-light"
        } else {
            return "bg-white text-dark"
        }
    }

    calculateCardImage = () => {
        if (this.props.zaposlen) {
            return <img src={require('../images/bitMan.jpg')} alt="bit-man" className="img-fluid w-50" />
        } else if (this.props.naPraksi) {
            return <img src={require('../images/bitWoman.jpg')} alt="bit-man" className="img-fluid w-50" />
        }
    }

    sendToOpenStudentDetailsModal = () => {
        this.props.openStudentDetailsModal(this.props.data.maticniBroj)
    }

    render() {
        return (
            <div onClick={this.sendToOpenStudentDetailsModal} className={`col-2 card bit-man-card-for-hover ${this.calculateCardColor(this.props)} ${this.props.zaposlen || this.props.naPraksi ? "bit-man-card" : "bit-man-card-student-list-view-borders"}`} >
                <div className={`card-header d-flex d-flex justify-content-center align-items-center ${this.props.zaposlen || this.props.naPraksi ? "" : "bit-man-card-student-list-view"}`}>
                    {this.calculateCardImage(this.props)}
                    <div className="d-flex flex-column justify-content-center align-items-center w-100">
                        <div>
                            <i>{this.calculateStatus()}</i>
                        </div>
                        <div>
                            <h5 className="bitman-card-header-title">{this.showWorkPosition(this.props.data)}</h5>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <h5 className="card-title">
                        {this.props.data.ime} {this.props.data.prezime}
                    </h5>
                    <p className="card-text">{this.props.data.mesto}</p>
                    <p className="card-text"><i>{this.props.data.obrazovanje}</i></p>
                    <p className="card-text">{this.props.data.datumRodjenja}</p>
                </div>
                <div className="modal-footer w-100">
                    {/* <button data-maticnibroj={props.data.maticniBroj} onClick={props.openStudentDetailsModal} type="button" className="btn student-details-button btn-light">
                        Otvori
                    </button> */}
                </div>
            </div>

        )
    }
}


export default BitManCard;
