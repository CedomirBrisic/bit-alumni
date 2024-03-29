import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import getAddNewStudentDropdowns from "../webhooks/getAddNewStudentDropdowns";
import postNewProgramiAndSertifikati from "../webhooks/postNewClassAndSertifikati";


class AddNewClassModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: "",
            datumZavrsetka: "",
            postojeciProgrami: "",
            kursPrice: ""
        }
    }


    humanReadDate = (inputDate) => {
        const months = ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"]
        const date = new Date(inputDate)
        const dd = date.getDate();
        const mm = months[date.getMonth()];
        const yy = date.getFullYear();

        return `${dd}. ${mm} ${yy}.`
    }

    setType = (event) => {
        const type = event.target.getAttribute("data-type");
        this.setState({
            type
        })
    }

    setDatumZavrsetka = (event) => {
        const newDate = new Date(event.target.value)
        this.setState({
            datumZavrsetka: newDate
        })
    }

    postProgram = () => {
        const naziv = this.state.type;
        let sertifikati = [];

        const datumZavrsetkaToSend = this.humanReadDate(this.state.datumZavrsetka);
        (naziv === "Frontend Bootcamp" ? sertifikati = ["Successfully attended", "Basic", "Advanced"] : sertifikati = ["Successfully attended"])

        const data = {
            naziv: naziv,
            datumZavrsetka: datumZavrsetkaToSend,
            sertifikati: sertifikati,
            kursPrice: parseInt(this.state.kursPrice, 10)
        }

        postNewProgramiAndSertifikati(data).then((response) => {
            this.props.closeAddNewClassModal()
        }).catch((error) => {
            alert(error)
        })
    }

    cancelPostingNewProgram = () => {
        this.setState({
            type: "",
            datumZavrsetka: "",
        })
        this.props.closeAddNewClassModal();
    }

    initialGettingStudentsDropdowns = () => {
        getAddNewStudentDropdowns().then((response) => {
            this.setState({
                postojeciProgrami: response[0].programi
            })
        }).catch((error) => {
            alert(error)
        })
    }

    componentDidMount() {
        this.initialGettingStudentsDropdowns()
    }

    mapPostojeciProgrami = () => {
        return this.state.postojeciProgrami.map((program, index) => {
            return <button key={program + index} type="button" className="btn btn-light program-select" data-type={program} onClick={this.setType}>{program}</button>
        })
    }
    setKursPrice = (event) => {
        this.setState({
            kursPrice: event.target.value
        })
    }


    render() {

        return (
            <Modal visible={this.props.visible} onClickBackdrop={this.props.closeAddNewClassModal}>
                <div className="modal-header">
                    <h5 className="modal-title">Red Alert!</h5>
                </div>
                <div className="modal-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="add-new-class-left-item">Izaberi format:</div>
                        <div className="add-new-class-right-item">
                            {this.state.postojeciProgrami ? this.mapPostojeciProgrami() : null}
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center add-new-class-datumzavrsetka-wrapper">
                        <div className="add-new-class-left-item">Izaberi datum poslednjeg dana kursa:</div>
                        <div className="add-new-class-right-item d-flex justify-content-center">
                            <input className="new-class-input" type="date" onChange={this.setDatumZavrsetka} />
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="add-new-class-left-item">Unesi cenu kursa</div>
                        <div className="add-new-class-right-item d-flex justify-content-center">
                            <input className="new-class-input" placeholder="EUR" type="number" value={this.state.kursPrice} onChange={this.setKursPrice} />
                        </div>
                    </div>
                    <div className="add-new-class-naziv">{this.state.type &&
                        `${this.state.type} - `}
                        {this.state.datumZavrsetka &&
                            this.humanReadDate(this.state.datumZavrsetka)}
                        {this.state.kursPrice &&
                            <div>
                                {this.state.kursPrice}€
                            </div>
                        }
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-warning text-success" onClick={this.cancelPostingNewProgram}>
                        Ništa, nema veze...
                    </button>
                    <button type="button" className="btn btn-success" onClick={this.postProgram}>
                        Potvrdi
                    </button>
                </div>
            </Modal>
        )
    }
}

export default AddNewClassModal;