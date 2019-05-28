import React, { Component } from 'react';
import getFirms from "../webhooks/getFirms";
import updateStudentPozicije from "../webhooks/updateStudentPozicije";
import IosConstruct from 'react-ionicons/lib/IosConstruct';
import DatePicker from 'react-date-picker';

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

            const months = ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"]
            const date = new Date(inputDate)
            const dd = date.getDate();
            const mm = months[date.getMonth()];
            const yy = date.getFullYear();
            
            return `${dd}. ${mm} ${yy}.`
        } else {
            return "Nemamo podatak"
        }
    }


    openAddPozicija = () => {
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
                    <div>
                        <div>
                            <b>{pozicija.firma}</b>
                        </div>
                        <div>
                            <i>{pozicija.status}</i>
                        </div>
                        <div>
                            Od - {this.dateHumanRead(pozicija.pocetak)}<br />
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
    

    setPocetak = (date) => {
        const newDate = new Date(date)
        this.setState({
            pocetak: newDate
        })
        // this.setState({
        //     pocetak: date
        // })
    }

    // setSvrsetak = (date) => {
    //     this.setState({
    //         svrsetak: date
    //     })
    // }

    componentDidMount() {
        this.getAndSetFirms()
    }


    render() {
        return (
            <div className="d-flex flex-column pozicije-container">
                <h6 className="details-card-setion-title">Istorija pozicija</h6>
                <div className="section-title-horizontal-line"></div>
                {this.mapPozicije()}
                {this.state.showAddPozicija &&
                    <div>
                        <select data-statename="selectedFirma" onChange={this.depositSelectedFirma}>
                            <option>Izaberi firmu</option>
                            {this.mapStateToDropdownOptions(this.state.firmeDropdown)}
                        </select>
                        <select data-statename="selectedStatus" onChange={this.depositSelectedStatus}>
                            <option>Izaberi status</option>
                            <option key="naPraksi" value="Na praksi">Na praksi</option>
                            <option key="zaposlen" value="Zaposlen">Zaposlen</option>
                        </select>
                        <div className="mt-3">Počevši od:</div>
                        <DatePicker calendarIcon={null}
                            value={this.state.pocetak}
                            onChange={this.setPocetak}
                        />
                        {/* <div className="mt-3">Pa sve do:</div>
                        <DatePicker calendarIcon={null}
                            value={this.state.svrsetak}
                            onChange={this.setSvrsetak}
                        /> */}
                        <button type="button" className="btn btn-success" onClick={this.dodajPoziciju}>
                            Dodaj
                        </button>
                    </div>
                }
                <IosConstruct color="#0e3572" fontSize="1.5vw" className="add-new-icon mt-5" onClick={this.openAddPozicija} />
            </div>
        )
    }
}

export default StudentPozicije;