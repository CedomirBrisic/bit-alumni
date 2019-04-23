import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import DatePicker from 'react-date-picker';
import getAddNewStudentDropdowns from "../webhooks/getAddNewStudentDropdowns";
import postNewProgramiAndSertifikati from "../webhooks/postNewClassAndSertifikati";


class AddNewClassModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: "",
            datumZavrsetka: "",
            postojeciProgrami: "",
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

    setDatumZavrsetka = (date) => {
        this.setState({
            datumZavrsetka: date
        })
    }

    postProgram = () => {
        const naziv = this.state.type;
        let sertifikati = [];
        
        const datumZavrsetkaToSend = this.humanReadDate(this.state.datumZavrsetka);
        (naziv === "Frontend Bootcamp" ? sertifikati=["Successfully attended", "Basic", "Advanced"] : sertifikati=["Successfully attended"])

        const data = {
            naziv: naziv,
            datumZavrsetka : datumZavrsetkaToSend,
            sertifikati: sertifikati
        }

        postNewProgramiAndSertifikati(data).then((response) => {
            if (response.status === 200 && response.ok === true) {
                this.props.closeAddNewClassModal()
            } else {
                alert("ACHTUNG!!!")
            }
        })
    }

    cancelPostingNewProgram = () => {
        this.setState({
            type: "",
            datumZavrsetka: "",
        })
        this.props.closeAddNewClassModal();
    }

    componentDidMount() {
        getAddNewStudentDropdowns().then((res) => {
            this.setState({
                postojeciProgrami: res[0].programi
            })
        })
    }

    mapPostojeciProgrami = () => {
        return this.state.postojeciProgrami.map((program) => {
            return <button className="btn program-select" data-type={program} onClick={this.setType}>{program}</button>
        })
    }


    render() {

        return (
            <Modal visible={this.props.visible} onClickBackdrop={this.props.closeAddNewClassModal}>
                <div className="modal-header">
                    <h5 className="modal-title">Red Alert!</h5>
                </div>
                <div className="modal-body">
                    <div className="student-detail-card-attribute d-flex justify-content-between align-items-center mb-3">
                        <div className="w-100">Izaberi formu:</div>
                        {this.state.postojeciProgrami ? this.mapPostojeciProgrami() : null}
                    </div>
                    <div className="student-detail-card-attribute d-flex justify-content-between align-items-center">
                        <div>Izaberi datum završetka:</div>
                        <DatePicker calendarIcon={null}
                            value={this.state.datumZavrsetka}
                            onChange={this.setDatumZavrsetka}
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <div>{this.state.type &&
                        `${this.state.type} -`}
                        {this.state.datumZavrsetka &&
                            this.humanReadDate(this.state.datumZavrsetka)}
                    </div>
                    <button type="button" className="btn btn-warning" onClick={this.cancelPostingNewProgram}>
                        Ništa, nema veze...
                    </button>
                    <button type="button" className="btn btn-primary" onClick={this.postProgram}>
                        Potvrdi
                    </button>
                </div>
            </Modal>
        )
    }
}

export default AddNewClassModal;