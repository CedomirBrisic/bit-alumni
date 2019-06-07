import React, { Component } from 'react';
import getAddNewStudentDropdowns from "../webhooks/getAddNewStudentDropdowns";
import postNewStudentAtStudenti from "../webhooks/postNewStudentAtStudenti";
import updateMestoAtStudentiDropdowns from "../webhooks/updateMestoAtStudentiDropdowns";
import updateObrazovanjeAtStudentiDropdowns from "../webhooks/updateObrazovanjeAStudentiDropdowns";
import IosConstruct from 'react-ionicons/lib/IosConstruct';
import Modal from 'react-bootstrap4-modal';


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
        let outputArray = stateArray.sort()
        return outputArray.map((element) => {
            return <option key={element} value={element}>{element}</option>
        })
    }

    setBirthDay = (event) => {
        const newDate = new Date(event.target.value)
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
    closeAddNewMestoEditor = () => {
        this.setState({
            addNewMestoEditor: false
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
        }).catch((error) => {
            alert (error)
        })
    }

    openAddNewObrazovanjeEditor = () => {
        this.setState({
            addNewObrazovanjeEditor: true
        })
    }
    closeAddNewObrazovanjeEditor = () => {
        this.setState({
            addNewObrazovanjeEditor: false,
            newObrazovanje: ""
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
        }).catch((error) => {
            alert (error)
        })
    }

    editMestoButtonsClasses = () => {
        if (this.state.addNewMestoEditor) {
            return "enter-firma-edit"
        } else {
            return ""
        }
    }
    editObrazovanjeButtonsClasses = () => {
        if (this.state.addNewObrazovanjeEditor) {
            return "enter-firma-edit"
        } else {
            return ""
        }
    }

    componentDidMount() {
        this.getAndSetNewStudentDropdowns();
    };

    render() {
        return (
            <Modal visible={this.props.visible} onClickBackdrop={this.closeNewBitManModal} fade={true} >
                <div className="modal-header">
                    <h5 className="modal-title">Red Alert!</h5>
                </div>
                <div className="modal-body d-flex flex-column justify-content-around">

                    <input type="text" placeholder="Ime" data-statename="ime" value={this.state.ime} onChange={this.depositToState} />
                    <input type="text" placeholder="Prezime" data-statename="prezime" value={this.state.prezime} onChange={this.depositToState} />
                    <input type="number" placeholder="Matični broj" data-statename="maticniBroj" value={this.state.maticniBroj} onChange={this.depositToState} />
                    <input type="email" placeholder="Email" data-statename="emailAdresa" value={this.state.emailAdresa} onChange={this.depositToState} />

                    <div className="add-new-student-datum-wrapper d-flex justify-content-between align-items-center">
                        <div className="w-50">Datum rođenja:</div>
                        <input type="date" className="w-50" onChange={this.setBirthDay} />
                    </div>



                    <div className="add-new-student-options-container  d-flex justify-content-between align-items-center">
                        <select className="add-new-student-dropdown add-new-student-select" data-statename="pol" onChange={this.depositToState}>
                            <option defaultValue>Izaberi pol</option>
                            <option value="alumnus">Muški</option>
                            <option value="alumna">Ženski</option>
                        </select>


                        {/*----- MESTO -----*/}
                        <div className="add-new-student-dropdown">
                            {this.state.addNewStudentDropdowns.mesta &&
                                <div className="w-100">
                                    <select data-statename="mesto" onChange={this.depositToState} className="w-75 add-new-student-select">
                                        <option defaultValue>Izaberi mesto</option>
                                        {this.mapStateToDropdownOptions(this.state.addNewStudentDropdowns.mesta)}
                                    </select>
                                    {!this.state.addNewMestoEditor &&
                                        <IosConstruct color="#0e3572" fontSize="1.5vw" className="open-edit" onClick={this.openAddNewMestoEditor} />
                                    }
                                </div>}
                            {this.state.addNewMestoEditor &&
                                <div>
                                    <input type="text" placeholder="Dodaj novo mesto" data-statename="newMesto" value={this.state.newMesto} onChange={this.depositToState} />
                                    <div className={`d-flex justify-content-between ${this.editMestoButtonsClasses()}`}>
                                        <button type="button" className="btn btn-warning text-success" onClick={this.closeAddNewMestoEditor}>
                                            Ništa, nema veze...
                                        </button>
                                        <button type="button" className="btn btn-success" onClick={this.putNewMesto}>
                                            Potvrdi
                                        </button>
                                    </div>
                                </div>}
                        </div>


                        {/*----- OBRAZOVANJE -----*/}
                        <div className="add-new-student-dropdown">
                            {this.state.addNewStudentDropdowns.obrazovanje &&
                                <div className="w-100">
                                    <select data-statename="obrazovanje" onChange={this.depositToState} className="w-75 add-new-student-select">
                                        <option defaultValue>Izaberi obrazovanje</option>
                                        {this.mapStateToDropdownOptions(this.state.addNewStudentDropdowns.obrazovanje)}
                                    </select>
                                    {!this.state.addNewObrazovanjeEditor &&
                                        <IosConstruct color="#0e3572" fontSize="1.5vw" className="open-edit" onClick={this.openAddNewObrazovanjeEditor} />
                                    }
                                </div>}
                            {this.state.addNewObrazovanjeEditor &&
                                <div>
                                    <input type="text" placeholder="Dodaj novo obrazovanje" data-statename="newObrazovanje" value={this.state.newObrazovanje} onChange={this.depositToState} />
                                    <div className={`d-flex justify-content-between ${this.editObrazovanjeButtonsClasses()}`}>
                                        <button type="button" className="btn btn-warning text-success" onClick={this.closeAddNewObrazovanjeEditor}>
                                            Ništa, nema veze...
                                        </button>
                                        <button type="button" className="btn btn-success" onClick={this.putNewObrazovanje}>
                                            Potvrdi
                                        </button>
                                    </div>
                                </div>}
                        </div>
                    </div>


                    <input type="tel" placeholder="Broj telefona" data-statename="brojTelefona" value={this.state.brojTelefona} onChange={this.depositToState} />
                    <input type="text" placeholder="Linkedin" data-statename="linkedin" value={this.state.linkedin} onChange={this.depositToState} />
                    <input type="text" placeholder="Facebook" data-statename="facebook" value={this.state.facebook} onChange={this.depositToState} />
                    <input type="text" placeholder="Instagram" data-statename="instagram" value={this.state.instagram} onChange={this.depositToState} />
                    <textarea placeholder="Komentar" rows="6" data-statename="komentar" value={this.state.komentar} onChange={this.depositToState}>

                    </textarea>
                </div>

                <div className="modal-footer d-flex">
                    {this.state.createNewStudentFailed &&
                        <div>Došlo je do greške, probaj ponovo</div>}
                    <button type="button" className="btn btn-success add-new-student-button" onClick={this.createNewStudent}>
                        Potvrdi
                    </button>
                </div>
            </Modal>
        );
    }
}

export default AddNewStudentModal;
