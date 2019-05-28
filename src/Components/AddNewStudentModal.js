import React, { Component } from 'react';
import getAddNewStudentDropdowns from "../webhooks/getAddNewStudentDropdowns";
import postNewStudentAtStudenti from "../webhooks/postNewStudentAtStudenti";
import updateMestoAtStudentiDropdowns from "../webhooks/updateMestoAtStudentiDropdowns";
import updateObrazovanjeAtStudentiDropdowns from "../webhooks/updateObrazovanjeAStudentiDropdowns";
import IosConstruct from 'react-ionicons/lib/IosConstruct';
import Modal from 'react-bootstrap4-modal';
import DatePicker from 'react-date-picker';


class AddNewStudentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addNewStudentDropdowns: {},
            ime: "",
            prezime: "",
            maticniBroj: "",
            emailAdresa: "",
            pol: "",
            linkedin: "",
            facebook: "",
            instagram: "",
            mesto: "",
            obrazovanje: "",
            datumRodjenja: "",
            brojTelefona: "",
            komentar: "",
            createNewStudentFailed: false,

            addNewMestoEditor: false,
            newMesto: "",
            addNewObrazovanjeEditor: false,
            newObrazovanje: ""
        }
    }

    mapStateToDropdownOptions = (stateArray) => {
        return stateArray.map((element) => {
            return <option key={element} value={element}>{element}</option>
        })
    }

    setBirthDay = (date) => {
        const newDate = new Date(date)
        this.setState({
            datumRodjenja: newDate
        })
    }

    depositToState = (event) => {
        const stateName = event.target.getAttribute("data-statename")
        this.setState({
            [stateName]: event.target.value
        })
    }

    getAndSetNewStudentDropdowns = () => {
        getAddNewStudentDropdowns().then((response) => {
            const addNewStudentDropdowns = response[0]
            this.setState({
                addNewStudentDropdowns
            })
        })
    }


    createNewStudent = () => {
        const data = {
            ime: this.state.ime,
            prezime: this.state.prezime,
            maticniBroj: this.state.maticniBroj,
            emailAdresa: this.state.emailAdresa,
            pol: this.state.pol,
            linkedin: this.state.linkedin,
            facebook: this.state.facebook,
            instagram: this.state.instagram,
            mesto: this.state.mesto,
            obrazovanje: this.state.obrazovanje,
            datumRodjenja: this.state.datumRodjenja,
            brojTelefona: this.state.brojTelefona,
            komentar: this.state.komentar
        }

        if (this.state.maticniBroj.length == 13) {
            postNewStudentAtStudenti(data).then((response) => {
                if (response.status === 200 && response.ok === true) {
                    this.props.closeNewBitManModal()
                    this.props.newStudentCreatedSuccessfullyModal(true)
                } else {
                    this.setState({
                        createNewStudentFailed: true
                    })
                }
            })
            this.setState({
                ime: "",
                prezime: "",
                maticniBroj: "",
                emailAdresa: "",
                pol: "",
                linkedin: "",
                facebook: "",
                instagram: "",
                mesto: "",
                obrazovanje: "",
                datumRodjenja: "",
                brojTelefona: "",
                komentar: ""
            })
        } else {
            alert(`Matični broj nije dobar
            - treba da ima 13 cifara`)
        }

    }



    closeNewBitManModal = () => {
        this.setState({
            addNewMestoEditor: false,
            newMesto: "",
        })
        this.props.closeNewBitManModal()
    }

    openAddNewMestoEditor = () => {
        this.setState({
            addNewMestoEditor: true
        })
    }

    putNewMesto = () => {
        const payload = this.state.newMesto;
        updateMestoAtStudentiDropdowns(payload).then((response) => {
            this.setState({
                addNewMestoEditor: false,
                newMesto: "",
            })
            this.getAndSetNewStudentDropdowns();
        })
    }

    openAddNewObrazovanjeEditor = () => {
        this.setState({
            addNewObrazovanjeEditor: true
        })
    }

    putNewObrazovanje = () => {
        const payload = this.state.newObrazovanje;
        updateObrazovanjeAtStudentiDropdowns(payload).then((response) => {
            this.setState({
                addNewObrazovanjeEditor: false,
                newObrazovanje: "",
            })
            getAddNewStudentDropdowns().then((response) => {
                const addNewStudentDropdowns = response[0]
                this.setState({
                    addNewStudentDropdowns
                })
            })
        })
    }
    componentDidMount() {
        this.getAndSetNewStudentDropdowns();
    };

    render() {
        return (
            <Modal visible={this.props.visible} onClickBackdrop={this.closeNewBitManModal} fade={true} >
                <div className="modal-header">
                    <h5 className="modal-title">BIT Student</h5>
                </div>
                <div className="modal-body d-flex flex-column justify-content-around">

                    <input type="text" placeholder="Ime" data-statename="ime" value={this.state.ime} onChange={this.depositToState} />
                    <input type="text" placeholder="Prezime" data-statename="prezime" value={this.state.prezime} onChange={this.depositToState} />
                    <input type="number" placeholder="Matični broj" data-statename="maticniBroj" value={this.state.maticniBroj} onChange={this.depositToState} />
                    <input type="email" placeholder="email" data-statename="emailAdresa" value={this.state.emailAdresa} onChange={this.depositToState} />
                    <input type="tel" placeholder="Broj telefona" data-statename="brojTelefona" value={this.state.brojTelefona} onChange={this.depositToState} />

                    <div className="row">
                        Datum rođenja:
                        <DatePicker calendarIcon={null}
                            value={this.state.datumRodjenja}
                            onChange={this.setBirthDay}
                        />
                    </div>

                    <select data-statename="pol" onChange={this.depositToState}>
                        <option defaultValue>Pol</option>
                        <option value="alumnus">Muški</option>
                        <option value="alumna">Ženski</option>
                    </select>


                    {/*----- MESTO -----*/}
                    {this.state.addNewStudentDropdowns.mesta &&
                        <div>
                            <select data-statename="mesto" onChange={this.depositToState}>
                                <option defaultValue>Mesto</option>
                                {this.mapStateToDropdownOptions(this.state.addNewStudentDropdowns.mesta)}
                            </select>
                            <IosConstruct color="#0e3572" fontSize="1.5vw" className="add-new-icon" onClick={this.openAddNewMestoEditor} />
                        </div>}
                    {this.state.addNewMestoEditor &&
                        <div>
                            <input type="text" placeholder="Dodaj novo mesto" data-statename="newMesto" value={this.state.newMesto} onChange={this.depositToState} />
                            <button type="button" className="btn btn-primary" onClick={this.putNewMesto}>
                                Potvrdi
                            </button>
                        </div>}


                    {/*----- OBRAZOVANJE -----*/}
                    {this.state.addNewStudentDropdowns.obrazovanje &&
                        <div>
                            <select data-statename="obrazovanje" onChange={this.depositToState}>
                                <option defaultValue>Obrazovanje</option>
                                {this.mapStateToDropdownOptions(this.state.addNewStudentDropdowns.obrazovanje)}
                            </select>
                            <IosConstruct color="#0e3572" fontSize="1.5vw" className="add-new-icon" onClick={this.openAddNewObrazovanjeEditor} />
                        </div>}
                    {this.state.addNewObrazovanjeEditor &&
                        <div>
                            <input type="text" placeholder="Dodaj novo obrazovanje" data-statename="newObrazovanje" value={this.state.newObrazovanje} onChange={this.depositToState} />
                            <button type="button" className="btn btn-primary" onClick={this.putNewObrazovanje}>
                                Potvrdi
                            </button>
                        </div>}


                    <input type="text" placeholder="Linkedin" data-statename="linkedin" value={this.state.linkedin} onChange={this.depositToState} />
                    <input type="text" placeholder="Facebook" data-statename="facebook" value={this.state.facebook} onChange={this.depositToState} />
                    <input type="text" placeholder="Instagram" data-statename="instagram" value={this.state.instagram} onChange={this.depositToState} />
                    <textarea placeholder="Komentar" rows="6" data-statename="komentar" value={this.state.komentar} onChange={this.depositToState}>

                    </textarea>
                </div>

                <div className="modal-footer d-flex">
                    {this.state.createNewStudentFailed &&
                        <div>Došlo je do greške, probaj ponovo</div>}
                    <button type="button" className="btn btn-primary" onClick={this.createNewStudent}>
                        Potvrdi
                    </button>
                </div>
            </Modal>
        );
    }
}

export default AddNewStudentModal;
