import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import DatePicker from 'react-date-picker';
import postNewProgramiAndSertifikati from "../webhooks/postNewProgramAndSertifikati";


class AddNewProgramModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: "",
            datumZavrsetka: "",
        }
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
        postNewProgramiAndSertifikati(this.state).then((response) => {
            if (response.status === 200 && response.ok === true) {
                this.props.closeAddNewProgramModal()
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
        this.props.closeAddNewProgramModal();
    }

    render() {

        return (
            <Modal visible={this.props.visible} onClickBackdrop={this.props.closeAddNewProgramModal}>
                <div className="modal-header">
                    <h5 className="modal-title">Red Alert!</h5>
                </div>
                <div className="modal-body">
                    <div className="student-detail-card-attribute d-flex justify-content-between align-items-center mb-3">
                        <div>Izaberi formu:</div>
                        <button className="btn program-select" data-type="bootcamp" onClick={this.setType}>Bootcamp</button>
                        <button className="btn program-select" data-type="kurs" onClick={this.setType}>Kurs</button>
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

export default AddNewProgramModal;