import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import updateStudents from "../webhooks/updateStudents";
import getAddNewStudentDropdowns from "../webhooks/getAddNewStudentDropdowns";

class StudentDetailsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            data: [],
            addNewStudentDropdowns: {},
        }
    }

    datumRodjenjaHumanRead = (inputDate) => {
        const months = ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"]
        const date = new Date(inputDate)
        const dd = date.getDate();
        const mm = months[date.getMonth()];
        const yy = date.getFullYear();

        return `${dd}. ${mm} ${yy}.`
    }

    editMode = () => {
        this.setState({
            editMode: !this.state.editMode,
            data: this.props.data
        })
    }
    depositToState = (event) => {
        const stateName = event.target.getAttribute("data-statename")
        this.setState({
            data: {
                ...this.state.data,
                [stateName]: event.target.value
            }
        })
    }

    closeStudentDetailsModal = () => {
        this.setState({
            editMode: false
        })
        this.props.closeStudentDetailsModal();
    }

    okButton = () => {
        if (this.state.editMode === false) {
            this.props.closeStudentDetailsModal();
        } else {
            const data = this.state.data;
            updateStudents(data).then((response) => {
                if (response.status === 200 && response.ok === true) {
                    this.closeStudentDetailsModal();
                } else {
                    alert(response)
                }
            })
        }
    }


    getAndSetNewStudentDropdowns = () => {
        getAddNewStudentDropdowns().then((response) => {
            const addNewStudentDropdowns = response[0]
            this.setState({
                addNewStudentDropdowns
            })
        })
    }


    componentDidMount() {
        this.getAndSetNewStudentDropdowns();
    };


    render() {

        return (
            <Modal visible={this.props.visible} onClickBackdrop={this.closeStudentDetailsModal} fade={true} >
                <div className="modal-header">
                    <h5 className="modal-title w-100 d-flex justify-content-between">
                        <div>
                            {this.props.data.pol}:
                    </div>
                        <div>
                            {this.state.editMode ? <input data-statename="ime" value={this.state.data.ime} onChange={this.depositToState} /> : this.props.data.ime}
                            &nbsp;
                            {this.state.editMode ? <input data-statename="prezime" value={this.state.data.prezime} onChange={this.depositToState} /> : this.props.data.prezime}
                        </div>
                    </h5>
                </div>
                <div className="modal-body d-flex justify-content-between">


                    {/* ----- OSNOVNI PODACI ----- */}
                    <div className="podaci-container d-flex flex-column">
                        <div className="podaci-wrapper">
                            <h6>Osnovni podaci</h6>
                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Matični broj:
                            </span>
                                <span className="w-50">
                                    {this.state.editMode ? <input type="number" data-statename="maticniBroj" value={this.state.data.maticniBroj} onChange={this.depositToState} /> : this.props.data.maticniBroj}
                                </span>
                            </div>
                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Datum rođenja:
                            </span>
                                <span className="w-50">
                                    {this.datumRodjenjaHumanRead(this.props.data.datumRodjenja)}
                                </span>
                            </div>
                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Mesto:
                            </span>
                                <span className="w-50">
                                    {this.state.editMode ? <input data-statename="mesto" value={this.state.data.mesto} onChange={this.depositToState} /> : this.props.data.mesto}
                                </span>
                            </div>
                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Email adresa:
                            </span>
                                <span className="w-50">
                                    {this.state.editMode ? <input data-statename="emailAdresa" value={this.state.data.emailAdresa} onChange={this.depositToState} /> : <a href={`mailto:${this.props.data.emailAdresa}`}>{this.props.data.emailAdresa}</a>}
                                </span>
                            </div>
                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Broj telefona:
                            </span>
                                <span className="w-50">
                                    {this.state.editMode ? <input type="tel" data-statename="brojTelefona" value={this.state.data.brojTelefona} onChange={this.depositToState} /> : <a href={`tel:${this.props.data.brojTelefona}`}>{this.props.data.brojTelefona}</a>}
                                </span>
                            </div>
                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Prethodno obrazovanje:
                                </span>
                                <span className="w-50">
                                    {this.props.data.obrazovanje}
                                </span>
                            </div>
                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Linkedin:
                            </span>
                                <span className="w-50">
                                    {this.state.editMode ? <input data-statename="linkedin" value={this.state.data.linkedin} onChange={this.depositToState} /> : <a href={this.props.data.linkedin} target="_blank">{this.props.data.linkedin}</a>}
                                </span>
                            </div>
                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Facebook:
                            </span>
                                <span className="w-50">
                                    {this.state.editMode ? <input data-statename="facebook" value={this.state.data.facebook} onChange={this.depositToState} /> : <a href={this.props.data.facebook} target="_blank">{this.props.data.facebook}</a>}
                                </span>
                            </div>
                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Instagram:
                            </span>
                                <span className="w-50">
                                    {this.state.editMode ? <input data-statename="instagram" value={this.state.data.instagram} onChange={this.depositToState} /> : <a href={this.props.data.instagram} target="_blank">{this.props.data.instagram}</a>}
                                </span>
                            </div>
                        </div>


                        {/* ----- DODATNE INFORMACIJE ----- */}
                        <div className="podaci-wrapper">
                            <h6>Dodatne informacije</h6>

                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Pohađani programi:
                        </span>
                                <span className="w-50">
                                    {/* mesto za programe */}
                                </span>
                            </div>

                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Sertifikati:
                        </span>
                                <span className="w-50">
                                    {/* mesto za sertifikate */}
                                </span>
                            </div>

                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Veštine:
                        </span>
                                <span className="w-50">
                                    {/* mesto za skills */}
                                </span>
                            </div>

                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Pozicije:
                        </span>
                                <span className="w-50">
                                    {/* mesto za pozicije */}
                                </span>
                            </div>

                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Status:
                        </span>
                                <span className="w-50">
                                    {/* dropdown trenutni status */}
                                </span>
                            </div>
                        </div>
                        <div className="student-detail-card-attribute d-flex">
                            <span className="w-50">
                                Komentar:
                            </span>
                            <span className="w-50">
                                {this.state.editMode ? <textarea placeholder="Komentar" rows="6" data-statename="komentar" value={this.state.data.komentar} onChange={this.depositToState}> </textarea> : this.props.data.komentar}
                            </span>
                        </div>
                    </div>


                    {/* ----- KOMUNIKACIJA ----- */}
                    <div className="komunikacija-container">
                        komunikacija
                    </div>
                </div>

                <div className="modal-footer d-flex justify-content-around">
                    <button type="button" className="btn btn-warning" onClick={this.editMode}>
                        {this.state.editMode ? "Ništa, nema veze..." : "Izmeni osnovne podatke"}
                    </button>
                    <button type="button" className="btn btn-success" onClick={this.okButton}>
                        {this.state.editMode ? "Sačuvaj izmene" : "OK"}
                    </button>
                    {/* <button type="button" className="btn btn-success" onClick={this.okButton}>
                        {this.state.editMode ? "Sačuvaj izmene" : "OK"}
                    </button> */}
                </div>
            </Modal>
        );
    }
}


export default StudentDetailsModal;

