import React, { Component } from 'react';
import BitManCard from "./BitManCard";

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

    componentDidUpdate(prevProps) {
        if (prevProps.selectedFirmaForFilter.nazivKompanije !== this.props.selectedFirmaForFilter.nazivKompanije) {
            this.filterStudentsForRender()
        }
    }
    componentDidMount() {
        this.filterStudentsForRender()
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


    render() {
        return (
            <div>
                <div className="d-flex firma-details-container justify-content-end">
                    <div className="mt-5 w-25">
                        <div className="d-flex justify-content-between">
                            <span>Naziv kompanije</span>
                            <span><b>{this.props.selectedFirmaForFilter.nazivKompanije}</b></span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>website:</span>
                            <span><b><a href={`${this.props.selectedFirmaForFilter.website}`} target="_blank">{this.props.selectedFirmaForFilter.website}</a></b></span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Email:</span>
                            <span><b><a href={`mailto:${this.props.selectedFirmaForFilter.emailAdresa}`}>{this.props.selectedFirmaForFilter.emailAdresa}</a></b></span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Telefon:</span>
                            <span><b><a href={`tel:${this.props.selectedFirmaForFilter.brojTelefona}`}>{this.props.selectedFirmaForFilter.brojTelefona}</a></b></span>
                        </div>
                    </div>

                    <div className="mt-5 ml-5 w-25 d-flex">
                        <div className="w-100">
                            <div><b>Trenutno stanje:</b></div>
                            <div className="d-flex justify-content-between">
                                <span>Praktikanata:</span>
                                <span><b>{this.state.selectedFirmTrenutnoNaPraksi}</b></span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Zaposlenih:</span>
                                <span><b>{this.state.selectedFirmTrenutnoZaposleni}</b></span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span><b>Trenutno u kompaniji:</b></span>
                                <span><b>{this.state.selectedFirmTrenutnoNaPraksi + this.state.selectedFirmTrenutnoZaposleni}</b></span>
                            </div>
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
                    {console.log(this.state.naPraksi.length, this.state.naPraksi.length > 0,  this.state.zaposleni.length,  this.state.zaposleni.length > 0)}
                    {(this.state.naPraksi.length > 0 || this.state.zaposleni.length > 0) &&
                        <div className="d-flex flex-column align-items-center mt-5">
                            <div>Ukupan broj studenata:</div>
                            <div><b>{this.state.zaposleni.length + this.state.naPraksi.length}</b></div>
                        </div>}
                    <div className="bit-people-cars-container d-flex justify-content-around row mt-5">
                        {this.mapZaposleni()}
                        {this.mapNaPraksi()}
                    </div>
                </div>
            </div>
        )
    }
};

export default StudentiByFirm;