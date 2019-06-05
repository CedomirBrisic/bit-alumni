import React, { Component } from 'react';
import getFirms from "../webhooks/getFirms";
import updateStudentPozicije from "../webhooks/updateStudentPozicije";
import MdAddCircle from 'react-ionicons/lib/MdAddCircle';


class StudentPozicije extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddPozicija: false,
            firmeDropdown: [],
            allFirmeiKompanije: {},
            selectedFirma: "",
            selectedStatus: "",
            pocetak: "",
            // svrsetak: "",
            pozicijeToSend: []
        }
    }

    dateHumanRead = (inputDate) => {
        if (inputDate) {

            const months = ["Januar", "Februar", "Mart", "April", "May", "Jun", "Jul", "August", "Septembar", "Octobar", "Novembar", "Decembar"]
            const date = new Date(inputDate)
            const dd = date.getDate();
            const mm = months[date.getMonth()];
            const yy = date.getFullYear();

            return `${dd}. ${mm} ${yy}.`
        } else {
            return "Nemamo podatak"
        }
    }


    toggleAddPozicija = () => {
        this.setState({
            showAddPozicija: !this.state.showAddPozicija
        })
    }


    dodajPoziciju = () => {

        let pozicijeToSend = [];
        const newPozicija = {
            firma: this.state.selectedFirma,
            status: this.state.selectedStatus,
            pocetak: this.state.pocetak,
            // svrsetak: this.state.svrsetak
        }
        if (this.props.studentData.pozicije) {
            pozicijeToSend = this.props.studentData.pozicije;
            pozicijeToSend.push(newPozicija);
        } else {
            pozicijeToSend[0] = newPozicija;
        }
        const data = {
            maticniBroj: this.props.studentData.maticniBroj,
            pozicije: pozicijeToSend
        }
        updateStudentPozicije(data).then((response) => {
            if (response.status === 200 && response.ok === true) {
                this.getAndSetFirms();
                this.setState({
                    showAddPozicija: false,
                })
                this.props.getStudentsFromStudenti()
            } else {
                alert(response)
            }
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


    mapStateToDropdownOptions = (stateArray) => {
        return stateArray.map((element) => {
            return <option key={element} value={element}>{element}</option>
        })
    }


    mapPozicije = () => {
        if (this.props.studentData.pozicije) {
            return this.props.studentData.pozicije.map((pozicija) => {
                const output =
                    <div className="single-pozicija-container">
                        <div className="pozicija-firma">
                            {pozicija.firma}
                        </div>
                        <div className="pozicija-status">
                            <i>{pozicija.status}</i>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Start:</span> <span>{this.dateHumanRead(pozicija.pocetak)}</span>
                            {/* Do - {this.dateHumanRead(pozicija.svrsetak)} */}
                        </div>
                    </div>
                return output
            })
        }
    }

    depositSelectedFirma = (event) => {
        this.setState({
            selectedFirma: event.target.value
        })
    }
    depositSelectedStatus = (event) => {
        this.setState({
            selectedStatus: event.target.value
        })
    }


    setPocetak = (event) => {
        const newDate = new Date(event.target.value)
        this.setState({
            pocetak: newDate
        })
    }

    componentDidMount() {
        this.getAndSetFirms()
    }
    editButtonsClasses = () => {
        if (this.state.showAddPozicija) {
            return "enter-firma-edit"
        } else {
            return "exit-firma-edit"
        }
    }


    render() {
        return (
            <div className="d-flex flex-column pozicije-container">
                <h6 className="details-card-setion-title">Istorija pozicija</h6>
                <div className="section-title-horizontal-line"></div>
                {this.mapPozicije()}
                {this.state.showAddPozicija &&
                    <div className="add-new-pozicija-container">
                        <select className="w-100 pozicija-select-dropdown" data-statename="selectedFirma" onChange={this.depositSelectedFirma}>
                            <option>Izaberi firmu</option>
                            {this.mapStateToDropdownOptions(this.state.firmeDropdown)}
                        </select>
                        <select className="w-100 pozicija-select-dropdown" data-statename="selectedStatus" onChange={this.depositSelectedStatus}>
                            <option>Izaberi status</option>
                            <option key="naPraksi" value="Na praksi">Na praksi</option>
                            <option key="zaposlen" value="Zaposlen">Zaposlen</option>
                        </select>
                        <div className="">Start:</div>
                        <input className="w-100" type="date" onChange={this.setPocetak}/>

                        <div className={`d-flex justify-content-between ${this.editButtonsClasses()}`}>
                            <button className="btn btn-warning text-success" onClick={this.toggleAddPozicija}>Ništa, nema veze...</button>
                            <button className="btn btn-success" onClick={this.dodajPoziciju}>Potvrdi</button>
                        </div>

                    </div>
                }
                {!this.state.showAddPozicija &&
                <MdAddCircle color="#8D1717" fontSize="2.4vw" className="add-new-icon" onClick={this.toggleAddPozicija} />
                }
            </div>
        )
    }
}

export default StudentPozicije;