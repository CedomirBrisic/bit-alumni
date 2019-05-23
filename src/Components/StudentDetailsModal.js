import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import Text from "react-format-text";
import updateStudents from "../webhooks/updateStudents";
import getAddNewStudentDropdowns from "../webhooks/getAddNewStudentDropdowns";
import getKlaseiSertifikati from "../webhooks/getKlaseiSerifikati";
import updatePohadjaniProgramAtStudent from "../webhooks/updateStudentPohadjaniProgram";
import updateStudentSertifikat from "../webhooks/updateStudentSertifikat";
import updateStudentStatus from "../webhooks/updateStudentStatus";
import updateVestineAtStudent from "../webhooks/updateVestineAtStudent";
import IosConstruct from 'react-ionicons/lib/IosConstruct';
import StudentPozicije from "../Components/StudentPozicije";
import Komunikacija from "../Components/Komunikacija"

class StudentDetailsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            data: {},
            addNewStudentDropdowns: {},
            studentPohadjaniProgrami: [],

            showDropdownPohadjaniProgrami: false,
            dropdownPohadjaniProgrami: [],
            selectedPohadjaniProgrami: [],

            showAddSertifikatToStudent: false,
            kurseviIsertifikati: [],
            selectedSertifikat: [],

            selectedStatus: "",
            showChangeStatus: false,

            showAddVestinaToStudent: false,
            selectedVestine: "",
            vestineToSend: [],
        }
    }

    dateHumanRead = (inputDate) => {
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

    depositDodatneInformacijeToState = (event) => {
        const stateName = event.target.getAttribute("data-statename")
        this.setState({
            [stateName]: event.target.value
        })
    }

    closeStudentDetailsModal = () => {
        this.setState({
            editMode: false
        })
        this.props.closeStudentDetailsModal();
    }

    okButton = () => {
        if (this.state.editMode === true ||
            this.state.showStudentDetailsModal === true) {
            const data = this.state.data;
            updateStudents(data).then((response) => {
                if (response.status === 200 && response.ok === true) {
                    this.closeStudentDetailsModal();
                    this.props.getStudentsFromStudenti();
                } else {
                    alert(response)
                }
            })
        } else {
            this.props.closeStudentDetailsModal();
            this.closeAddProgramToStudent();
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

    getAndSetKlaseiSertifikati = () => {
        let dropdownPohadjaniProgrami = [];
        getKlaseiSertifikati().then((response) => {
            response.forEach(element => {
                const datumZavrsetka = this.dateHumanRead(element.datumZavrsetka);
                const klasa = `${element.naziv} - ${datumZavrsetka}`
                dropdownPohadjaniProgrami.push(klasa)
            });
            this.setState({
                dropdownPohadjaniProgrami,
                kurseviIsertifikati: response
            })
        })
    }

    openAddProgramToStudent = () => {
        this.setState({
            showDropdownPohadjaniProgrami: true
        })
    }

    closeAddProgramToStudent = () => {
        this.setState({
            showDropdownPohadjaniProgrami: false
        })
    }



    openAddSertifikatToStudent = () => {
        this.setState({
            showAddSertifikatToStudent: true
        })
    }

    closeAddSertifikatToStudent = () => {
        this.setState({
            showAddSertifikatToStudent: false
        })
    }

    mapStateToDropdownOptions = (stateArray) => {
        return stateArray.map((element) => {
            return <option key={element} value={element}>{element}</option>
        })
    }

    dodajPohadjaniProgram = () => {
        let pohadjaniProgramiToSend = [];
        if (this.props.data.pohadjaniProgrami) {
            pohadjaniProgramiToSend = this.props.data.pohadjaniProgrami;
            pohadjaniProgramiToSend.push(this.state.selectedPohadjaniProgrami);
        } else {
            pohadjaniProgramiToSend[0] = this.state.selectedPohadjaniProgrami;
        }
        const data = {
            maticniBroj: this.props.data.maticniBroj,
            pohadjaniProgrami: pohadjaniProgramiToSend
        }
        updatePohadjaniProgramAtStudent(data).then((response) => {
            if (response.status === 200 && response.ok === true) {
                this.props.getStudentsFromStudenti();
                this.setState({
                    showDropdownPohadjaniProgrami: false,
                })
            } else {
                alert(response)
            }
        })
    }

    mapArrayToListItem = (data) => {
        return data.map((element) => {
            return <div>{element}</div>
        })
    }

    dodajSertifikat = () => {
        let sertifikatToSend = [];
        if (this.props.data.sertifikati) {
            sertifikatToSend = this.props.data.sertifikati;
            sertifikatToSend.push(this.state.selectedSertifikat);
        } else {
            sertifikatToSend[0] = this.state.selectedSertifikat;
        }
        const data = {
            maticniBroj: this.props.data.maticniBroj,
            sertifikati: sertifikatToSend
        }
        updateStudentSertifikat(data).then((response) => {
            if (response.status === 200 && response.ok === true) {
                this.props.getStudentsFromStudenti();
                this.setState({
                    showAddSertifikatToStudent: false,
                })
            } else {
                alert(response)
            }
        })
        this.closeAddSertifikatToStudent()

    }

    showDropdownPossibleSertifikati = () => {
        let possibilities = [];
        const kurseviIsertifikati = this.state.kurseviIsertifikati;
        this.props.data.pohadjaniProgrami &&
            this.props.data.pohadjaniProgrami.forEach((kurs) => {
                let kursArr = kurs.split(" - ")
                for (let i = 0; i < kurseviIsertifikati.length; i++) {
                    if (kursArr[0] == kurseviIsertifikati[i].naziv &&
                        kursArr[1] == kurseviIsertifikati[i].datumZavrsetka) {
                        for (let j = 0; j < kurseviIsertifikati[i].sertifikati.length; j++) {
                            const oneSertifikatPossibility = `${kurseviIsertifikati[i].sertifikati[j]} (${kurseviIsertifikati[i].naziv} - ${kurseviIsertifikati[i].datumZavrsetka})`
                            possibilities.push(oneSertifikatPossibility)
                        }
                    }
                }
            })
        return possibilities.map((sertifikat) => {
            return <option key={sertifikat} value={sertifikat}>{sertifikat}</option>
        })
    }

    openChangeStatus = () => {
        this.setState({
            showChangeStatus: true,
        })
    }


    dodajStatus = () => {
        const data = {
            maticniBroj: this.props.data.maticniBroj,
            status: this.state.selectedStatus
        }

        updateStudentStatus(data).then((response) => {
            if (response.status === 200 && response.ok === true) {
                this.props.getStudentsFromStudenti();
                this.setState({
                    showChangeStatus: false,
                })
            } else {
                alert(response)
            }
        })
    }


    openAddVestinaToStudent = () => {
        this.setState({
            showAddVestinaToStudent: true,
        })
    }


    dodajVestinu = () => {
        let vestineToSend = [];
        if (this.props.data.vestine) {
            vestineToSend = this.props.data.vestine;
            vestineToSend.push(this.state.selectedVestine);
        } else {
            vestineToSend[0] = this.state.selectedVestine;
        }
        const data = {
            maticniBroj: this.props.data.maticniBroj,
            vestine: vestineToSend
        }

        updateVestineAtStudent(data).then((response) => {
            if (response.status === 200 && response.ok === true) {
                this.props.getStudentsFromStudenti();
                this.setState({
                    showAddVestinaToStudent: false,
                })
            } else {
                alert(response)
            }
        })
    }


    componentDidMount() {
        this.getAndSetNewStudentDropdowns();
        this.getAndSetKlaseiSertifikati();
    };


    render() {

        return (
            <Modal visible={this.props.visible} onClickBackdrop={this.closeStudentDetailsModal} fade={true} className="modal-container">
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
                                    {this.dateHumanRead(this.props.data.datumRodjenja)}
                                </span>
                            </div>
                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Mesto:
                                </span>
                                <span className="w-50">
                                    {this.props.data.mesto}
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
                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Komentar:
                            </span>
                                <span className="w-50">
                                    {this.state.editMode ? <textarea placeholder="Komentar" rows="6" data-statename="komentar" value={this.state.data.komentar} onChange={this.depositToState}> </textarea> : <Text>{this.props.data.komentar}</Text>}
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
                                    {this.props.data.pohadjaniProgrami ? this.mapArrayToListItem(this.props.data.pohadjaniProgrami) : null}
                                </span>
                                <IosConstruct color="#0e3572" fontSize="1.5vw" className="add-new-icon" onClick={this.openAddProgramToStudent} />
                                {this.state.showDropdownPohadjaniProgrami &&
                                    <div>
                                        <select data-statename="selectedPohadjaniProgrami" onChange={this.depositDodatneInformacijeToState}>
                                            <option>Izaberi program</option>
                                            {this.mapStateToDropdownOptions(this.state.dropdownPohadjaniProgrami)}
                                        </select>
                                        <button type="button" className="btn btn-success" onClick={this.dodajPohadjaniProgram}>
                                            Dodaj
                                    </button>
                                    </div>}
                            </div>

                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Sertifikati:
                                </span>
                                <span className="w-50">
                                    {this.props.data.sertifikati ? this.mapArrayToListItem(this.props.data.sertifikati) : null}
                                </span>
                                <IosConstruct color="#0e3572" fontSize="1.5vw" className="add-new-icon" onClick={this.openAddSertifikatToStudent} />
                                {this.state.showAddSertifikatToStudent &&
                                    <div>
                                        <select data-statename="selectedSertifikat" onChange={this.depositDodatneInformacijeToState}>
                                            <option>Izaberi Sertifikat</option>
                                            {this.showDropdownPossibleSertifikati()}
                                        </select>
                                        <button type="button" className="btn btn-success" onClick={this.dodajSertifikat}>
                                            Dodaj
                                        </button>
                                    </div>}
                            </div>

                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Veštine:
                                </span>
                                <span className="w-50">
                                    {this.props.data.vestine ? this.mapArrayToListItem(this.props.data.vestine) : null}
                                </span>
                                <IosConstruct color="#0e3572" fontSize="1.5vw" className="add-new-icon" onClick={this.openAddVestinaToStudent} />
                                {this.state.showAddVestinaToStudent &&
                                    <div>
                                        <select data-statename="selectedVestine" onChange={this.depositDodatneInformacijeToState}>
                                            <option>Izaberi Veštinu</option>
                                            {this.mapStateToDropdownOptions(this.state.addNewStudentDropdowns.vestine)}
                                        </select>
                                        <button type="button" className="btn btn-success" onClick={this.dodajVestinu}>
                                            Dodaj
                                        </button>
                                    </div>}
                            </div>

                            <div className="student-detail-card-attribute d-flex">
                                <span className="w-50">
                                    Trenutni status:
                                </span>
                                <span className="w-50">
                                    {this.props.data.status &&
                                        <div>{this.props.data.status}</div>}
                                </span>
                                <IosConstruct color="#0e3572" fontSize="1.5vw" className="add-new-icon" onClick={this.openChangeStatus} />
                                {this.state.showChangeStatus &&
                                    <div>
                                        <select data-statename="selectedStatus" onChange={this.depositDodatneInformacijeToState}>
                                            <option>Izaberi trenutni Status</option>
                                            {this.mapStateToDropdownOptions(this.state.addNewStudentDropdowns.statusi)}
                                        </select>
                                        <button type="button" className="btn btn-success" onClick={this.dodajStatus}>
                                            Dodaj
                                        </button>
                                    </div>}
                            </div>
                        </div>
                    </div>


                    {this.props.visible &&
                        <StudentPozicije studentData={this.props.data} getStudentsFromStudenti={this.props.getStudentsFromStudenti} />}


                    {/* ----- KOMUNIKACIJA ----- */}
                    <div className="komunikacija-container">
                        <Komunikacija komunikacijaData={this.props.data.komunikacija} maticniBroj={this.props.data.maticniBroj} getStudentsFromStudenti={this.props.getStudentsFromStudenti} />
                    </div>
                </div>

                <div className="modal-footer d-flex justify-content-around">
                    <button type="button" className="btn btn-warning" onClick={this.editMode}>
                        {this.state.editMode ? "Ništa, nema veze..." : "Izmeni osnovne podatke"}
                    </button>
                    <button type="button" className="btn btn-success" onClick={this.okButton}>
                        {this.state.editMode ? "Sačuvaj izmene" : "OK"}
                    </button>
                </div>
            </Modal>
        );
    }
}


export default StudentDetailsModal;

