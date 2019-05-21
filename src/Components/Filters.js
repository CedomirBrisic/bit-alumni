import React, { Component } from 'react';
import getAddNewStudentDropdowns from "../webhooks/getAddNewStudentDropdowns";
import getKlaseiSertifikati from "../webhooks/getKlaseiSerifikati";
import getFirms from "../webhooks/getFirms";

class Filters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addNewStudentDropdowns: {},
            kurseviIsertifikati: [],
            firmeDropdown: [],
            allFirmeiKompanije: {},

            pohadjaniProgrami: {},
            mesta: {},
            pol: {},
            sertifikati: {},
            vestine: {},
            status: {},
            prethodnoObrazovanje: {},
            firme: {}
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
        const kurseviIsertifikati = [];
        getKlaseiSertifikati().then((response) => {
            let responseSortedByName = response;
            responseSortedByName.sort(function (a, b) {
                let nazivA = a.naziv.toLowerCase();
                let nazivB = b.naziv.toLowerCase();
                if (nazivA < nazivB) return -1;
                if (nazivA > nazivB) return 1;
                return 0
            })
            responseSortedByName.forEach(element => {
                const klasa = `${element.naziv} - ${element.datumZavrsetka}`
                kurseviIsertifikati.push(klasa)
            });
            this.setState({
                kurseviIsertifikati
            })
        })
    }

    getAndSetFirms = () => {
        const firme = [];
        getFirms().then((response) => {
            let responseSortedByName = response;
            responseSortedByName.sort(function (a, b) {
                let firmaA = a.nazivKompanije.toLowerCase();
                let firmaB = b.nazivKompanije.toLowerCase();
                if (firmaA < firmaB) return -1;
                if (firmaA > firmaB) return 1;
                return 0
            })
            responseSortedByName.forEach(element => {
                const firma = `${element.nazivKompanije}`
                firme.push(firma)
            });
            this.setState({
                firmeDropdown: firme,
                allFirmeiKompanije: responseSortedByName,
            })
        })
    }


    // ----- KURSEVI I POHADJANI PROGRAMI ----- //

    togglePohadjaniProgramiCheckboxes = (event) => {
        const stateName = event.target.getAttribute("data-statename")

        this.setState({
            pohadjaniProgrami: {
                ...this.state.pohadjaniProgrami,
                [stateName]: event.target.checked
            }
        })
    }

    mapPohadjaniProgrami = () => {
        let kurseviIsertifikati = this.state.kurseviIsertifikati;

        if (kurseviIsertifikati !== undefined) {

            return kurseviIsertifikati.map((element) => {
                const output =
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id={"id" + element} key={element} data-statename={element} onClick={this.togglePohadjaniProgramiCheckboxes} />
                        <label className="form-check-label" htmlFor={"id" + element}>{element}</label>
                    </div>
                return output
            })
        }
    }


    // ----- SERTIFIKATI ----- //

    toggleSertifikat = (event) => {
        const stateName = event.target.getAttribute("data-statename")

        this.setState({
            sertifikati: {
                ...this.state.sertifikati,
                [stateName]: event.target.checked
            }
        })
    }




    // ----- MESTA ----- //

    toggleMestaCheckboxes = (event) => {
        const stateName = event.target.getAttribute("data-statename")

        this.setState({
            mesta: {
                ...this.state.mesta,
                [stateName]: event.target.checked
            }
        })
    }

    mapMesto = () => {
        let mesta = this.state.addNewStudentDropdowns.mesta;
        if (mesta !== undefined) {
            mesta.sort()

            return mesta.map((element) => {
                const output =
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id={"id" + element} key={element} data-statename={element} onClick={this.toggleMestaCheckboxes} />
                        <label className="form-check-label" htmlFor={"id" + element}>{element}</label>
                    </div>
                return output
            })
        }
    }


    // ----- POL ----- //

    toggleStudentSex = (event) => {
        const stateName = event.target.getAttribute("data-statename")

        this.setState({
            pol: {
                ...this.state.pol,
                [stateName]: event.target.checked
            }
        })
    }



    // ----- VESTINE ----- //

    toggleVestineCheckboxes = (event) => {
        const stateName = event.target.getAttribute("data-statename")

        this.setState({
            vestine: {
                ...this.state.vestine,
                [stateName]: event.target.checked
            }
        })
    }

    mapVestine = () => {
        let vestine = this.state.addNewStudentDropdowns.vestine;
        if (vestine !== undefined) {
            vestine.sort()

            return vestine.map((element) => {
                const output =
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id={"id" + element} key={element} data-statename={element} onClick={this.toggleVestineCheckboxes} />
                        <label className="form-check-label" htmlFor={"id" + element}>{element}</label>
                    </div>
                return output
            })
        }
    }




    // ----- STATUSI ----- //

    toggleStatusiCheckboxes = (event) => {
        const stateName = event.target.getAttribute("data-statename")

        this.setState({
            status: {
                ...this.state.status,
                [stateName]: event.target.checked
            }
        })
    }

    mapStatusi = () => {
        let status = this.state.addNewStudentDropdowns.statusi;
        if (status !== undefined) {
            status.sort()

            return status.map((element) => {
                const output =
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id={"id" + element} key={element} data-statename={element} onClick={this.toggleStatusiCheckboxes} />
                        <label className="form-check-label" htmlFor={"id" + element}>{element}</label>
                    </div>
                return output
            })
        }
    }




    // ----- PRETHODNO OBRAZOVANJE ----- //

    togglePrethodnoObrazovanjeCheckboxes = (event) => {
        const stateName = event.target.getAttribute("data-statename")

        this.setState({
            prethodnoObrazovanje: {
                ...this.state.prethodnoObrazovanje,
                [stateName]: event.target.checked
            }
        })
    }

    mapPrethodnoObrazovanje = () => {
        let prethodnoObrazovanje = this.state.addNewStudentDropdowns.obrazovanje;
        if (prethodnoObrazovanje !== undefined) {
            prethodnoObrazovanje.sort()

            return prethodnoObrazovanje.map((element) => {
                const output =
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id={"id" + element} key={element} data-statename={element} onClick={this.togglePrethodnoObrazovanjeCheckboxes} />
                        <label className="form-check-label" htmlFor={"id" + element}>{element}</label>
                    </div>
                return output
            })
        }
    }




    // ----- FIRME I KOMPANIJE ----- //

    toggleFirmeiKompanijeCheckboxes = (event) => {
        const stateName = event.target.getAttribute("data-statename")

        this.setState({
            firme: {
                ...this.state.firme,
                [stateName]: event.target.checked
            }
        })
    }

    mapFirmeiKompanije = () => {

        let firmeiKompanije = this.state.firmeDropdown;
        if (firmeiKompanije !== []) {

            return firmeiKompanije.map((element) => {
                const output =
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id={"id" + element} key={element} data-statename={element} onClick={this.toggleFirmeiKompanijeCheckboxes} />
                        <label className="form-check-label" htmlFor={"id" + element}>{element}</label>
                    </div>
                return output
            })
        }
    }


    sendFilterToMainComponent = () => {
        const filters = {
            pol: this.state.pol,
            pohadjaniProgrami: this.state.pohadjaniProgrami,
            sertifikati: this.state.sertifikati,
            vestine: this.state.vestine,
            status: this.state.status,
            obrazovanje: this.state.prethodnoObrazovanje,
            pozicije: this.state.firme,
            mesto: this.state.mesta,
        }

        this.props.filterStudentsForRendering(filters)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState !== this.state) {
            this.sendFilterToMainComponent();
        }
    }

    componentDidMount() {
        this.getAndSetNewStudentDropdowns();
        this.getAndSetKlaseiSertifikati();
        this.getAndSetFirms();
    }

    render() {
        return (
            <div className="d-flex justify-content-between pt-5">
                <div>
                    FILTERI:
                </div>
                <div>
                    <div className="filter-item">Pol</div>
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="idAlumnus" key="alumnusKey" data-statename="alumnus" onClick={this.toggleStudentSex} />
                        <label className="form-check-label" htmlFor="idAlumnus">Alumnus</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="idAlumna" key="alumnaKey" data-statename="alumna" onClick={this.toggleStudentSex} />
                        <label className="form-check-label" htmlFor="idAlumna">Alumna</label>
                    </div>
                </div>
                <div>
                    <div className="filter-item">Programi i Kursevi</div>
                    {this.mapPohadjaniProgrami()}
                </div>

                <div>
                    <div className="filter-item">Sertifikati</div>
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="successfullyAttended" key="successfullyAttendedKey" data-statename="successfully-attended" onClick={this.toggleSertifikat} />
                        <label className="form-check-label" htmlFor="successfullyAttended">Successfully attended</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="basicId" key="basicKey" data-statename="basic" onClick={this.toggleSertifikat} />
                        <label className="form-check-label" htmlFor="basicId">Basic</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="idAdvanced" key="advancedKey" data-statename="advanced" onClick={this.toggleSertifikat} />
                        <label className="form-check-label" htmlFor="idAdvanced">Advanced</label>
                    </div>
                </div>
                <div>
                    <div className="filter-item">Status</div>
                    {this.mapStatusi()}
                </div>
                <div>
                    <div className="filter-item">Firme i Kompanije</div>
                    {this.mapFirmeiKompanije()}
                </div>
                <div>
                    <div className="filter-item">Prethodno Obrazovanje</div>
                    {this.mapPrethodnoObrazovanje()}
                </div>
                <div>
                    <div className="filter-item">Mesto</div>
                    {this.mapMesto()}
                </div>
                <div>
                    <div className="filter-item">Veštine</div>
                    {this.mapVestine()}
                </div>
            </div>
        );
    }
}

export default Filters;









