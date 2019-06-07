import React, { Component } from 'react';
import BitManCard from "./BitManCard";
import IosClockOutline from 'react-ionicons/lib/IosClockOutline';
import IosConstructOutline from 'react-ionicons/lib/IosConstructOutline';
import updateFirma from "../webhooks/updateFirma";



class StudentiByFirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zaposleni: [],
            naPraksi: [],

            selectedFirmTrenutnoZaposleni: 0,
            selectedFirmTrenutnoNaPraksi: 0,
            selectedFirmIkadaZaposlenih: 0,
            selectedFirmIkadaNaPraksi: 0,
            zaposliloSePoslePrakse: 0,

            openFirmaDetailsEditMode: false,
            initialLoading: true,

            nazivKompanije: "",
            website: "",
            email: "",
            telefon: ""
        }

    }

    filterStudentsForRender = () => {
        const zaposleni = [];
        const naPraksi = [];
        let selectedFirmTrenutnoZaposleni = 0;
        let selectedFirmTrenutnoNaPraksi = 0;
        let selectedFirmIkadaZaposlenih = 0;
        let selectedFirmIkadaNaPraksi = 0;
        let zaposliloSePoslePrakse = 0;

        if (this.props.studentiAll !== undefined && this.props.selectedFirmaForFilter.nazivKompanije !== undefined) {
            this.props.studentiAll.forEach((student) => {
                if (student.pozicije !== undefined) {
                    student.pozicije.forEach((pozicija, index) => {
                        if (pozicija.firma == this.props.selectedFirmaForFilter.nazivKompanije) {
                            if (pozicija.status == "Zaposlen") {
                                if (index == student.pozicije.length - 1) {
                                    student = {
                                        ...student,
                                        aktivnaPozicija: true,
                                    }
                                    selectedFirmTrenutnoZaposleni++
                                }
                                zaposleni.push(student)
                            } else if (pozicija.status == "Na praksi") {
                                if (index == student.pozicije.length - 1) {
                                    student = {
                                        ...student,
                                        aktivnaPozicija: true,
                                    }
                                    selectedFirmTrenutnoNaPraksi++
                                }
                                naPraksi.push(student)
                            }
                        }
                    })
                }
            });
        }


        const zaposleniRemovedDuplicates = [];
        const zaposleniMaticniBrojevi = [];
        zaposleni.forEach((student) => {
            const indx = zaposleniRemovedDuplicates.indexOf(student);
            if (indx == -1) {
                zaposleniRemovedDuplicates.push(student)
                zaposleniMaticniBrojevi.push(student.maticniBroj)
            }
        })
        const naPraksiRemovedDuplicates = [];
        const naPosluSaPrakseMaticniBrojevi = [];
        naPraksi.forEach((student) => {
            const indx = naPraksiRemovedDuplicates.indexOf(student);
            const indxmtbr = zaposleniMaticniBrojevi.indexOf(student.maticniBroj)
            if (indx == -1 && indxmtbr == -1) {
                naPraksiRemovedDuplicates.push(student)
            } else if (indxmtbr !== -1) {
                naPosluSaPrakseMaticniBrojevi.push(student.maticniBroj)
            }
        })

        const zaposleniRemovedDuplicates2 = [];
        zaposleniRemovedDuplicates.forEach((student) => {
            const indx = naPosluSaPrakseMaticniBrojevi.indexOf(student.maticniBroj);
            if (indx !== -1) {
                student = {
                    ...student,
                    saPrakseNaPosao: true
                }
            }
            zaposleniRemovedDuplicates2.push(student)
        })

        selectedFirmIkadaZaposlenih = zaposleniRemovedDuplicates2.length;
        selectedFirmIkadaNaPraksi = naPraksiRemovedDuplicates.length + naPosluSaPrakseMaticniBrojevi.length;
        zaposliloSePoslePrakse = naPosluSaPrakseMaticniBrojevi.length

        this.setState({
            zaposleni: zaposleniRemovedDuplicates2,
            naPraksi: naPraksiRemovedDuplicates,
            selectedFirmTrenutnoZaposleni,
            selectedFirmTrenutnoNaPraksi,
            selectedFirmIkadaZaposlenih,
            selectedFirmIkadaNaPraksi,
            zaposliloSePoslePrakse
        })
    }

    initState = () => {
        this.setState({
            nazivKompanije: this.props.selectedFirmaForFilter.nazivKompanije,
            website: this.props.selectedFirmaForFilter.website,
            email: this.props.selectedFirmaForFilter.emailAdresa,
            telefon: this.props.selectedFirmaForFilter.brojTelefona
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedFirmaForFilter !== this.props.selectedFirmaForFilter) {
            this.filterStudentsForRender();
            this.initState();
        }
    }
    componentDidMount() {
        this.filterStudentsForRender();
        this.initState();
    }

    mapZaposleni = () => {
        const zaposleniForRender = []
        this.state.zaposleni.forEach((student) => {
            if (student.aktivnaPozicija) {
                zaposleniForRender.unshift(student)
            } else {
                zaposleniForRender.push(student)
            }
        })
        return zaposleniForRender.map((student) => {
            return <BitManCard key={student.maticniBroj}
                data={student}
                openStudentDetailsModal={this.props.openStudentDetailsModal}
                zaposlen={true} />
        })
    }

    mapNaPraksi = () => {
        const naPraksiForRender = []
        this.state.naPraksi.forEach((student) => {
            if (student.aktivnaPozicija) {
                naPraksiForRender.unshift(student)
            } else {
                naPraksiForRender.push(student)
            }
        })
        return naPraksiForRender.map((student) => {
            return <BitManCard key={student.maticniBroj}
                data={student}
                openStudentDetailsModal={this.props.openStudentDetailsModal}
                naPraksi={true} />
        })
    }



    // EDITOVANJE FIRME IZ KARTICE

    openFirmaEdit = () => {
        this.setState({
            openFirmaDetailsEditMode: true,
            initialLoading: false,
        })
    }
    closeFirmaEditMode = () => {
        this.setState({
            openFirmaDetailsEditMode: false,
            initialLoading: false,
        })
        this.initState()
    }

    editButtonsClasses = () => {
        if (this.state.initialLoading) {
            return ""
        } else if (this.state.openFirmaDetailsEditMode) {
            return "enter-firma-edit"
        } else {
            return "exit-firma-edit"
        }
    }

    depositToState = (event) => {
        const stateName = event.target.getAttribute("data-statename")
        this.setState({
            [stateName]: event.target.value
        })
    }

    sendEditedFirma = () => {
        const data = {
            findId: this.props.selectedFirmaForFilter._id.$oid,
            nazivKompanije: this.state.nazivKompanije,
            emailAdresa: this.state.email,
            brojTelefona: this.state.telefon,
            website: this.state.website,
        }

        updateFirma(data).then((response) => {
                this.props.getAndSetFirms()
                this.setState({
                    openFirmaDetailsEditMode: false
                })
        }).catch((error) => {
            alert (error)
        })
    }


    render() {
        return (
            <div onClick={this.props.closeFilters}>
                <div className="d-flex firma-details-container justify-content-around">
                    <div className="firma-details-opste-informacije d-flex flex-column justify-content-around">
                        <div className="d-flex justify-content-between">
                            <span className="firma-details-attribute">Naziv kompanije:</span>
                            <span className="firma-details-naziv">
                                {this.state.openFirmaDetailsEditMode ? <input className="firma-details-naziv" data-statename="nazivKompanije" value={this.state.nazivKompanije} onChange={this.depositToState} /> : <span>{this.props.selectedFirmaForFilter.nazivKompanije}</span>}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span className="firma-details-attribute">Website:</span>
                            <span>
                                {this.state.openFirmaDetailsEditMode ? <input data-statename="website" value={this.state.website} onChange={this.depositToState} /> : <span><b><a href={`http://${this.props.selectedFirmaForFilter.website}`} target="_blank">{this.props.selectedFirmaForFilter.website}</a></b></span>}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span className="firma-details-attribute">Email:</span>
                            <span>
                                {this.state.openFirmaDetailsEditMode ? <input data-statename="email" value={this.state.email} onChange={this.depositToState} /> : <span><b><a href={`mailto:${this.props.selectedFirmaForFilter.emailAdresa}`}>{this.props.selectedFirmaForFilter.emailAdresa}</a></b></span>}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span className="firma-details-attribute">Telefon:</span>
                            <span>
                                {this.state.openFirmaDetailsEditMode ? <input data-statename="telefon" value={this.state.telefon} onChange={this.depositToState} /> : <span><b><a href={`tel:${this.props.selectedFirmaForFilter.brojTelefona}`}>{this.props.selectedFirmaForFilter.brojTelefona}</a></b></span>}
                            </span>
                        </div>
                        {/* {this.state.openFirmaDetailsEditMode &&} */}
                        <div className={`firma-details-edit-buttons-container d-flex justify-content-between ${this.editButtonsClasses()}`}>
                            <button className="btn btn-warning text-success" onClick={this.closeFirmaEditMode}>Ništa, nema veze...</button>
                            <button className="btn btn-success text-warning" onClick={this.sendEditedFirma}>Potvrdi</button>
                        </div>

                        <IosConstructOutline color="#8D1717" fontSize="2vw" className="firma-details-opste-edit-button" onClick={this.openFirmaEdit} />
                    </div>

                    <div className="d-flex flex-column justify-content-around firma-details-stanje">
                        <div className="d-flex align-items-center w-100"><IosClockOutline color="#8D1717" fontSize="1.8vw" />
                        {/* <span className="firma-details-stanje-title">Trenutno stanje</span> */}
                        </div>
                        <div className="d-flex justify-content-between">
                            <span className="firma-details-attribute">Praktikanata:</span>
                            <span><b>{this.state.selectedFirmTrenutnoNaPraksi}</b></span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span className="firma-details-attribute">Zaposlenih:</span>
                            <span><b>{this.state.selectedFirmTrenutnoZaposleni}</b></span>
                        </div>
                        <div className="d-flex justify-content-between firma-detials-stanje-total">
                            <span><b>Trenutno u kompaniji:</b></span>
                            <span><b>{this.state.selectedFirmTrenutnoNaPraksi + this.state.selectedFirmTrenutnoZaposleni}</b></span>
                        </div>

                        {/* <div className="w-50 ml-5">
                        <div><b>Ukupno stanje:</b></div>
                            <div className="d-flex justify-content-between">
                                <span>Zaposlilo se posle prakse:</span>
                                <span><b>{this.state.zaposliloSePoslePrakse}</b></span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Praktikanata:</span>
                                <span><b>{this.state.selectedFirmIkadaNaPraksi}</b></span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Zaposlenih:</span>
                                <span><b>{this.state.selectedFirmIkadaZaposlenih}</b></span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Ukupno studenata:</span>
                                <span><b>{this.state.zaposleni.length + this.state.naPraksi.length}</b></span>
                            </div>
                        </div> */}
                    </div>
                </div>
                <div>
                    <div className="d-flex flex-column align-items-center ukupan-broj-studenata-wrapper ime-prezime-modal-header">
                        <div><i>Ukupan broj BIT studenata:</i></div>
                        <div><b>{this.state.zaposleni.length + this.state.naPraksi.length}</b></div>
                    </div>
                    {/* {(this.state.naPraksi.length > 0 || this.state.zaposleni.length > 0) &&
                        <div className="d-flex flex-column align-items-center ime-prezime-modal-header">
                        </div>} */}
                    <div className="bit-people-cars-container d-flex justify-content-around row">
                        {this.mapZaposleni()}
                        {this.mapNaPraksi()}
                    </div>
                </div>
            </div>
        )
    }
};

export default StudentiByFirm;