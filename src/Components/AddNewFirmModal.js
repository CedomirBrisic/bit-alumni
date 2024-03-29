import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import postAddNewKompanija from "../webhooks/postAddNewKompanija";

class AddNewFirmModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nazivKompanije: "",
            emailAdresa: "",
            brojTelefona: "",
            website: "",
        }
    }

    postFirm = () => {
        const data = {
            nazivKompanije: this.state.nazivKompanije,
            emailAdresa: this.state.emailAdresa,
            brojTelefona: this.state.brojTelefona,
            website: this.state.website,
        }

        postAddNewKompanija(data).then((response) => {
                this.props.closeAddNewFirm()
        }).catch((error) => {
            alert (error)
        })

        this.setState({
            nazivKompanije: "",
            emailAdresa: "",
            brojTelefona: "",
            website: "",
        })
    }

    cancelPostingFirm = () => {
        this.setState({
            nazivKompanije: "",
            emailAdresa: "",
            brojTelefona: "",
            website: "",
        })
        this.props.closeAddNewFirm();

    }

    depositToState = (event) => {
        const stateName = event.target.getAttribute("data-statename")
        this.setState({
            [stateName]: event.target.value
        })
    }

    render() {
        return (
            <Modal visible={this.props.visible} onClickBackdrop={this.props.closeAddNewFirm}>
                <div className="modal-header">
                    <h5 className="modal-title">Red Alert!</h5>
                </div>
                <div className="modal-body d-flex flex-column">
                    <input type="text" placeholder="Naziv kompanije" data-statename="nazivKompanije" value={this.state.nazivKompanije} onChange={this.depositToState} />
                    <input type="text" placeholder="Website" data-statename="website" value={this.state.website} onChange={this.depositToState} />
                    <input type="email" placeholder="Email adresa" data-statename="emailAdresa" value={this.state.emailAdresa} onChange={this.depositToState} />
                    <input type="tel" placeholder="Broj telefona" data-statename="brojTelefona" value={this.state.brojTelefona} onChange={this.depositToState} />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-warning text-success" onClick={this.cancelPostingFirm}>
                        Ništa, nema veze...
                    </button>
                    <button type="button" className="btn btn-success text-warning" onClick={this.postFirm}>
                        Potvrdi
                    </button>
                </div>
            </Modal>
        )
    }
}

export default AddNewFirmModal