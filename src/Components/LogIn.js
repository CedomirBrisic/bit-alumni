import React, { Component } from 'react';
import getKey from "../webhooks/getKey";
import MeltingComponent from "./MeltingComponent";

class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showInput: false,
            hiddenValue: "",
            isVisibleModal: false,
        }
    }

    openInput = () => {
        this.setState({
            showInput: true
        })
    }
    tryToLogIn = (event) => {
        this.setState({
            hiddenValue: event.target.value
        })
    }
    checkKey = (event) => {
        if (event.key === "Enter") {
            getKey(this.state.hiddenValue).then((response) => {
                if (response[0] !== undefined && response[0].qwerty) {
                    this.props.secretKey(response[0].qwerty)
                } else {
                    // alert("ACHTUNG!!! \n Najverovatnije ne valja šifra", response)
                    this.setState({
                        hiddenValue: "",
                        isVisibleModal: true
                    })
                }
            })
        }
    }
    enterBitAlumni = () => {
        if (!this.state.showInput) {
            this.setState({
                isVisibleModal: true
            })
        } else {

            getKey(this.state.hiddenValue).then((response) => {
                if (response !== undefined && response[0] !== undefined && response[0].qwerty) {
                    this.props.secretKey(response[0].qwerty)
                } else {
                    // alert("ACHTUNG!!! \n Najverovatnije ne valja šifra", response)
                    this.setState({
                        hiddenValue: "",
                        isVisibleModal: true
                    })
                }
            })
        }
    }

    shutDownModal = () => {
        this.setState({
            isVisibleModal: false
        })
    }


    render() {
        return (
            <div>
                <MeltingComponent visible={this.state.isVisibleModal} shutDownModal={this.shutDownModal} />
                <div className="login-page-container d-flex justify-content-center align-items-center">
                    <div className="login-page-wrapper d-flex flex-column">
                        {this.state.showInput &&
                            <input type="password" value={this.state.hiddenValue} onChange={this.tryToLogIn} onKeyPress={this.checkKey} className="login-input" />
                        }
                        <div className="logovanje-button" onClick={this.enterBitAlumni}>Uloguj se</div>
                    </div>
                    <div className="nevidljivi" onClick={this.openInput}></div>
                </div>
            </div>
        )
    }
}

export default LogIn;