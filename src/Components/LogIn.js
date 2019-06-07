import React, {
    Component
} from 'react';
import getKey from "../webhooks/getKey";

class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // showInput: false,
            hiddenValue: "",
        }
    }

    // openInput = () => {
    //     this.setState({
    //         showInput: true
    //     })
    // }
    tryToLogIn = (event) => {
        this.setState({
            hiddenValue: event.target.value
        })
    }
    checkKey = (event) => {
        if (event.key == "Enter") {
            getKey(this.state.hiddenValue).then((response) => {
                if (response[0] !== undefined && response[0].qwerty) {
                    this.props.secretKey(response[0].qwerty)
                } else {
                    alert("ACHTUNG!!! \n Najverovatnije ne valja šifra", response)
                    this.setState({
                        hiddenValue: ""
                    })
                }
            })
        }
    }


    render() {
        return (

            <div className="login-page-container d-flex justify-content-center align-items-center">
                <div className="login-page-wrapper">
                    {/* {this.state.showInput && */}
                        <input type="password"  value={this.state.hiddenValue} onChange={this.tryToLogIn} onKeyPress={this.checkKey} className="login-input" />
                    {/* } */}
                </div>
                {/* <div className="nevidljivi" onClick={this.openInput}></div> */}
            </div>
        )
    }
}

export default LogIn;