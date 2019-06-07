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
import IosConstructOutline from 'react-ionicons/lib/IosConstructOutline';
import MdAddCircle from 'react-ionicons/lib/MdAddCircle';
import StudentPlacanje from "../Components/StudentPlacanje";
import StudentPozicije from "../Components/StudentPozicije";
import Komunikacija from "../Components/Komunikacija"
import { CoreStitchServiceClientImpl } from 'mongodb-stitch-core-sdk';

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
        const months = ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "August", "Septembar", "Octobar", "Novembar", "Decembar"]
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
                    this.closeStudentDetailsModal();
                    this.props.getStudentsFromStudenti();
            }).catch((error) => {
                alert (error)
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
        }).catch((error) => {
            alert (error)
        })
    }

    toggleAddProgramToStudent = () => {
        this.setState({
            showDropdownPohadjaniProgrami: !this.state.showDropdownPohadjaniProgrami
        })
    }

    closeAddProgramToStudent = () => {
        this.setState({
            showDropdownPohadjaniProgrami: false
        })
    }



    toggleAddSertifikatToStudent = () => {
        this.setState({
            showAddSertifikatToStudent: !this.state.showAddSertifikatToStudent
        })
    }

    closeAddSertifikatToStudent = () => {
        this.setState({
            showAddSertifikatToStudent: false
        })
    }

    mapStateToDropdownOptions = (stateArray) => {
        return stateArray.sort().map((element) => {
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
                this.props.getStudentsFromStudenti();
                this.setState({
                    showDropdownPohadjaniProgrami: false,
                })
        }).catch((error) => {
            alert (error)
        })
    }

    mapArrayToListItem = (data) => {
        return data.map((element) => {
            return <div>{element}</div>
        })
    }
    mapVestineArrayToListItem = (data) => {
        return data.sort().map((element) => {
            return <div className="vestina-single-item">{element}</div>
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
                this.props.getStudentsFromStudenti();
                this.setState({
                    showAddSertifikatToStudent: false,
                })
        }).catch((error) => {
            alert (error)
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

    toggleChangeStatus = () => {
        this.setState({
            showChangeStatus: !this.state.showChangeStatus,
        })
    }



    dodajStatus = () => {
        const data = {
            maticniBroj: this.props.data.maticniBroj,
            status: this.state.selectedStatus
        }

        updateStudentStatus(data).then((response) => {
                this.props.getStudentsFromStudenti();
                this.setState({
                    showChangeStatus: false,
                })
        }).catch((error) => {
            alert (error)
        })
    }


    toggleAddVestinaToStudent = () => {
        this.setState({
            showAddVestinaToStudent: !this.state.showAddVestinaToStudent,
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
                this.props.getStudentsFromStudenti();
                this.setState({
                    showAddVestinaToStudent: false,
                })
        }).catch((error) => {
            alert (error)
        })
    }

    setStudentsProgramiSertifikati = () => {
        let pohadjaniProgrami = [];
        if (this.props.data.pohadjaniProgrami) {
            pohadjaniProgrami = this.props.data.pohadjaniProgrami;
        }
        const sertifikati = (this.props.data.sertifikati !== undefined ? this.props.data.sertifikati : []);
        let studentSertifikatiAccordion = {}

        if (pohadjaniProgrami !== undefined && pohadjaniProgrami.length > 0) {

            pohadjaniProgrami.forEach((program) => {
                const programName = program.split(" - ")[0];
                const programDate = program.split(" - ")[1];
                const programSertifikati = []
                if (sertifikati !== undefined) {
                    sertifikati.forEach((sertifikat) => {
                        const sertifikatProgramName = sertifikat.split(" - ")[0];
                        const sertifikatProgramDate = sertifikat.split(" - ")[1];
                        if (sertifikatProgramName.includes(programName) && sertifikatProgramDate.includes(programDate)) {
                            programSertifikati.push(sertifikatProgramName.split(" (")[0])
                        }
                    })
                }
                studentSertifikatiAccordion = {
                    ...studentSertifikatiAccordion,
                    [program]: programSertifikati.sort()
                }
            })
            this.setState({
                studentSertifikatiAccordion
            })
        } else {
            this.setState({
                studentSertifikatiAccordion: {}
            })
        }
    }



    calculateSertifikati = (sertifikati) => {
        return sertifikati.map((sertifikat, index) => {
            return <span className="details-sertifikat">{sertifikat}</span>
        })
    }

    renderProgramiSertifikati = () => {
        const output = [];
        if (this.state.studentSertifikatiAccordion !== undefined && this.state.studentSertifikatiAccordion !== null) {

            const studentProgramiSertifikati = this.state.studentSertifikatiAccordion
            const programiPropertyName = Object.getOwnPropertyNames(studentProgramiSertifikati)

            programiPropertyName.forEach((program, index) => {
                const btnTitle = program.split(" - ")

                const outputElement =
                    <div className="accordion" id="accordionProgramiSertifikati">
                        <div className="card">
                            <div className="card-header" id={`programSertifikat-${index}`}>
                                <h2 className="">
                                    <button className="btn btn-link d-flex justify-content-between align-items-center" type="button" data-toggle="collapse" data-target={`#sertifikatProgram-${index}`} aria-expanded="false" aria-controls={`sertifikatProgram-${index}`}>
                                        <div>{btnTitle[0]}</div>
                                        <div>{btnTitle[1]}</div>
                                    </button>
                                </h2>
                            </div>

                            <div id={`sertifikatProgram-${index}`} className="collapse" aria-labelledby={`programSertifikat-${index}`} data-parent="#accordionProgramiSertifikati">
                                <div className="card-body">
                                    {this.calculateSertifikati(studentProgramiSertifikati[program])}
                                    {!this.state.showAddSertifikatToStudent &&
                                        <MdAddCircle color="#8D1717" fontSize="2.4vw" className="open-edit" onClick={this.toggleAddSertifikatToStudent} />
                                    }
                                </div>
                                {this.state.showAddSertifikatToStudent &&
                                    <div className="d-flex flex-column align-items-center">
                                        <select data-statename="selectedSertifikat" className="add-new-sertifikat" onChange={this.depositDodatneInformacijeToState}>
                                            <option>Izaberi Sertifikat</option>
                                            {this.showDropdownPossibleSertifikati()}
                                        </select>
                                        <div className={`add-sertifikat-buttons-container d-flex justify-content-between ${this.editButtonsClassessertifikati()}`}>
                                            <button className="btn btn-warning text-success" onClick={this.toggleAddSertifikatToStudent}>Ništa, nema veze...</button>
                                            <button className="btn btn-success" onClick={this.dodajSertifikat}>Potvrdi</button>
                                        </div>
                                    </div>}
                            </div>
                        </div>
                    </div>

                output.push(outputElement)
            })

        }
        return output
    }

    editButtonsClasses = () => {
        if (this.state.showDropdownPohadjaniProgrami) {
            return "enter-firma-edit"
        } else {
            return "exit-firma-edit"
        }
    }
    editButtonsClassessertifikati = () => {
        if (this.state.showAddSertifikatToStudent) {
            return "enter-firma-edit"
        } else {
            return "exit-firma-edit"
        }
    }
    editStatusButtonsClasses = () => {
        if (this.state.showChangeStatus) {
            return "enter-firma-edit"
        } else {
            return "exit-firma-edit"
        }
    }
    editVestineButtonsClasses = () => {
        if (this.state.showAddVestinaToStudent) {
            return "enter-firma-edit"
        } else {
            return "exit-firma-edit"
        }
    }





    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setStudentsProgramiSertifikati()
        }
    }
    componentDidMount() {
        this.getAndSetNewStudentDropdowns();
        this.getAndSetKlaseiSertifikati();
    };



    render() {
        return (
            <Modal visible={this.props.visible} onClickBackdrop={this.closeStudentDetailsModal} fade={true} className="modal-container">
                <div className="student-details-container">
                    <div className="modal-header d-flex flex-column align-items-center">
                        <h5 className="modal-title w-100 d-flex flex-column justify-content-center align-items-center">
                            <div>
                                {this.props.data.pol}
                            </div>
                            <div className="ime-prezime-modal-header">
                                {this.state.editMode ? <input data-statename="ime" value={this.state.data.ime} onChange={this.depositToState} placeholder="Ime..." /> : this.props.data.ime}
                                &nbsp;
                            {this.state.editMode ? <input data-statename="prezime" value={this.state.data.prezime} onChange={this.depositToState} placeholder="Ime..." /> : this.props.data.prezime}
                            </div>
                        </h5>
                        <div className="d-flex flex-column align-items-center">
                            <div className="d-flex student-status-header justify-content-around">
                                {this.props.data.status &&
                                    <div>{this.props.data.status}</div>}
                                {!this.state.showChangeStatus &&
                                    <IosConstructOutline color="#8D1717" fontSize="1.5vw" className="open-edit" onClick={this.toggleChangeStatus} />
                                }
                            </div>
                            {this.state.showChangeStatus &&
                                <div className="d-flex flex-column">
                                    <select className="change-status-dropdown" data-statename="selectedStatus" onChange={this.depositDodatneInformacijeToState}>
                                        <option>Izaberi trenutni Status</option>
                                        {this.mapStateToDropdownOptions(this.state.addNewStudentDropdowns.statusi)}
                                    </select>
                                    <div className={`add-pohadjani-programi-buttons-container d-flex justify-content-around ${this.editStatusButtonsClasses()}`}>
                                        <button className="btn btn-warning text-success" onClick={this.toggleChangeStatus}>Ništa, nema veze...</button>
                                        <button className="btn btn-success" onClick={this.dodajStatus}>Potvrdi</button>
                                    </div>
                                </div>}
                        </div>
                    </div>

                    <div className="modal-body d-flex justify-content-around">

                        {/* ----- OSNOVNI PODACI ----- */}
                        <div className="podaci-container d-flex flex-column">

                            <div id="accordion">
                                <div className="card podaci-wrapper">
                                    <div className="card-header" id="headingOne">
                                        <h5 className="mb-0">
                                            <button className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                <h6 className="details-card-setion-title">Osnovni podaci</h6>
                                                <div className="section-title-horizontal-line"></div>
                                            </button>
                                        </h5>
                                    </div>

                                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                                        <div className="card-body">
                                            <div className="d-flex">
                                                <span className="student-detail-card-attribute">
                                                    Matični broj:
                                                </span>
                                                <span className="student-detail-card-data">
                                                    {this.state.editMode ? <input type="number" data-statename="maticniBroj" value={this.state.data.maticniBroj} onChange={this.depositToState} /> : this.props.data.maticniBroj}
                                                </span>
                                            </div>
                                            <div className=" d-flex">
                                                <span className="student-detail-card-attribute">
                                                    Datum rođenja:
                                                </span>
                                                <span className="student-detail-card-data">
                                                    {this.dateHumanRead(this.props.data.datumRodjenja)}
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <span className="student-detail-card-attribute">
                                                    Mesto:
                                                </span>
                                                <span className="student-detail-card-data">
                                                    {this.props.data.mesto}
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <span className="student-detail-card-attribute">
                                                    Email adresa:
                                                </span>
                                                <span className="student-detail-card-data">
                                                    {this.state.editMode ? <input data-statename="emailAdresa" value={this.state.data.emailAdresa} onChange={this.depositToState} /> : <a href={`mailto:${this.props.data.emailAdresa}`}>{this.props.data.emailAdresa}</a>}
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <span className="student-detail-card-attribute">
                                                    Broj telefona:
                                                </span>
                                                <span className="student-detail-card-data">
                                                    {this.state.editMode ? <input type="tel" data-statename="brojTelefona" value={this.state.data.brojTelefona} onChange={this.depositToState} /> : <a href={`tel:${this.props.data.brojTelefona}`}>{this.props.data.brojTelefona}</a>}
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <span className="student-detail-card-attribute">
                                                    Prethodno obrazovanje:
                                                </span>
                                                <span className="student-detail-card-data">
                                                    {this.props.data.obrazovanje}
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <span className="student-detail-card-attribute">
                                                    Linkedin:
                                                </span>
                                                <span className="student-detail-card-data">
                                                    {this.state.editMode ? <input data-statename="linkedin" value={this.state.data.linkedin} onChange={this.depositToState} /> : <a href={this.props.data.linkedin} target="_blank">{this.props.data.linkedin}</a>}
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <span className="student-detail-card-attribute">
                                                    Facebook:
                                                </span>
                                                <span className="student-detail-card-data">
                                                    {this.state.editMode ? <input data-statename="facebook" value={this.state.data.facebook} onChange={this.depositToState} /> : <a href={this.props.data.facebook} target="_blank">{this.props.data.facebook}</a>}
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <span className="student-detail-card-attribute">
                                                    Instagram:
                                                </span>
                                                <span className="student-detail-card-data">
                                                    {this.state.editMode ? <input data-statename="instagram" value={this.state.data.instagram} onChange={this.depositToState} /> : <a href={this.props.data.instagram} target="_blank">{this.props.data.instagram}</a>}
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <span className="student-detail-card-attribute">
                                                    Komentar:
                                                </span>
                                                <span className="student-detail-card-data">
                                                    {this.state.editMode ? <textarea placeholder="Komentar" rows="8" data-statename="komentar" value={this.state.data.komentar} onChange={this.depositToState}> </textarea> : <div className="student-details-motiv"><Text>{this.props.data.komentar}</Text></div>}
                                                </span>
                                            </div>


                                            <div className="d-flex justify-content-around align-items-center">
                                                <button type="button" className="btn btn-warning text-success edit-modal-button" onClick={this.editMode}>
                                                    {this.state.editMode ? "Ništa, nema veze..." : "Izmeni"}
                                                </button>
                                                {this.state.editMode &&
                                                    <button type="button" className="btn edit-modal-button btn-success d-flex justify-content-center align-items-center" onClick={this.okButton}>
                                                        Sačuvaj
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card podaci-wrapper">
                                    <div className="card-header" id="headingTwo">
                                        <h5 className="mb-0">
                                            <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                <h6 className="details-card-setion-title">{`Sertifikati & veštine`}</h6>
                                                <div className="section-title-horizontal-line"></div>
                                            </button>
                                        </h5>
                                    </div>
                                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                                        <div className="card-body">
                                            <div className="d-flex flex-column align-items-center justify-content-between">
                                                <span className="programi-sertifikati-accordion-container">
                                                    {this.renderProgramiSertifikati()}
                                                </span>
                                                {!this.state.showDropdownPohadjaniProgrami &&
                                                    <MdAddCircle color="#8D1717" fontSize="2.4vw" className="add-program" onClick={this.toggleAddProgramToStudent} />
                                                }
                                                {this.state.showDropdownPohadjaniProgrami &&
                                                    <div className="add-pohadjani-program">
                                                        <select data-statename="selectedPohadjaniProgrami" onChange={this.depositDodatneInformacijeToState}>
                                                            <option>Izaberi program</option>
                                                            {this.mapStateToDropdownOptions(this.state.dropdownPohadjaniProgrami)}
                                                        </select>
                                                        <div className={`add-pohadjani-programi-buttons-container d-flex justify-content-around ${this.editButtonsClasses()}`}>
                                                            <button className="btn btn-warning text-success" onClick={this.toggleAddProgramToStudent}>Ništa, nema veze...</button>
                                                            <button className="btn btn-success" onClick={this.dodajPohadjaniProgram}>Potvrdi</button>
                                                        </div>
                                                    </div>}
                                            </div>

                                            <div className="d-flex flex-column">
                                                <div className="d-flex align-items-center">
                                                    <span className="student-detail-card-attribute">
                                                        Veštine:
                                                    </span>
                                                    <span className="student-detail-card-data-vestine row">
                                                        {this.props.data.vestine ? this.mapVestineArrayToListItem(this.props.data.vestine) : null}
                                                    </span>
                                                    {!this.state.showAddVestinaToStudent &&
                                                        <MdAddCircle color="#8D1717" fontSize="2.4vw" className="open-edit" onClick={this.toggleAddVestinaToStudent} />
                                                    }
                                                </div>
                                                {this.state.showAddVestinaToStudent &&
                                                    <div className="d-flex flex-column align-items-center ">
                                                        <select className="add-vestina-container" data-statename="selectedVestine" onChange={this.depositDodatneInformacijeToState}>
                                                            <option>Izaberi Veštinu</option>
                                                            {this.mapStateToDropdownOptions(this.state.addNewStudentDropdowns.vestine)}
                                                        </select>
                                                        <div className={`add-vestina-buttons-container d-flex justify-content-around ${this.editVestineButtonsClasses()}`}>
                                                            <button className="btn btn-warning text-success" onClick={this.toggleAddVestinaToStudent}>Ništa, nema veze...</button>
                                                            <button className="btn btn-success" onClick={this.dodajVestinu}>Potvrdi</button>
                                                        </div>
                                                    </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card podaci-wrapper">
                                    <div className="card-header" id="headingPlacanje">
                                        <h5 className="mb-0">
                                            <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapsePlacanje" aria-expanded="false" aria-controls="collapsePlacanje">
                                                <h6 className="details-card-setion-title">Finansijski podaci</h6>
                                                <div className="section-title-horizontal-line"></div>
                                            </button>
                                        </h5>
                                    </div>
                                    <div id="collapsePlacanje" className="collapse" aria-labelledby="headingPlacanje" data-parent="#accordion">
                                        <div className="card-body">
                                            <StudentPlacanje />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="pozicije-komunikacija-container d-flex">
                            <StudentPozicije studentData={this.props.data} getStudentsFromStudenti={this.props.getStudentsFromStudenti} />
                            {/* ----- KOMUNIKACIJA ----- */}
                            <Komunikacija komunikacijaData={this.props.data.komunikacija} maticniBroj={this.props.data.maticniBroj} getStudentsFromStudenti={this.props.getStudentsFromStudenti} />
                        </div>
                    </div>


                    <div className="modal-footer d-flex justify-content-center align-items-center">
                        {!this.state.editMode &&
                            <button type="button" className="btn ok-modal-button btn-success  d-flex justify-content-center align-items-center" onClick={this.okButton}>
                                Zatvori
                        </button>
                        }
                    </div>
                </div>
            </Modal>
        );
    }
}


export default StudentDetailsModal;

