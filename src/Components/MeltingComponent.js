import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';


class MeltingComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 12,
            startCountingBoom: false,
            boom: false,
            hideGandalf: false,
            bombsFilds: [],
            bombsExploded: []
        }
        this.timer = 0;
        this.timer2 = 0;
    }

    startCounting = () => {
        this.timer = setInterval(this.countdown, 1000);
    }
    countdown = () => {
        let counterMezzanine = this.state.counter

        if (this.state.counter === 8) {
            this.setState({
                startCountingBoom: true,
                hideGandalf: true
            })
        } else if (this.state.counter > 0) {
            this.setState({
                counter: counterMezzanine - 1,
            })
        }

        if (this.state.counter === 0) {
            this.setState({
                boom: true
            })
            clearInterval(this.timer)
        } else if (this.state.counter > 0) {
            this.setState({
                counter: counterMezzanine - 1
            })
        }
    }


    placeBombsFilds = () => {
        const bombsFilds = []
        for (let i = 0; i < 10000; i++) {
            const bomb = <div className="single-bomb"></div>
            bombsFilds.push(bomb)
        }
        this.setState({
            bombsFilds
        })
        this.startPlacingBombs()
    }


    startPlacingBombs = () => {
        // this.placeBombsFilds()
        this.timer2 = setInterval(this.placeBombs, 1)
    }
    // getRandomInt =() => {
    //     return Math.floor(Math.random() * Math.floor(100));
    //   }

    placeBombs = () => {
        const bombsFilds = this.state.bombsFilds;
        const bombsExploded = this.state.bombsExploded;

        for (let i = 0; i < 1; i++) {
            const bombToExplode = Math.floor(Math.random() * Math.floor(10000))
            if (bombsExploded.indexOf(bombToExplode) == -1) {
                bombsFilds[bombToExplode] = <div className="single-bomb exploded"></div>
                bombsExploded.push(bombToExplode)
            } else {
                i = -1;
            }
        }
        this.setState({
            bombsFilds,
            bombsExploded
        })

        if (bombsExploded.length === 10000) {
            clearInterval(this.timer2)
        }
    }



    componentDidUpdate(prevProps, prevState) {
        if (prevProps.visible === false && this.props.visible) {
            this.startCounting();
        }
        if (prevState.boom === false && this.state.boom) {
            this.placeBombsFilds()
        }
    }
    render() {
        return (
            // onClickBackdrop={this.props.shutDownModal}
            <Modal visible={this.props.visible} fade={true} className="melting-component-container">

                <div className="d-flex justify-content-center align-items-center video-wrapper">
                    {
                        this.props.visible &&
                        < video className={`gandalf ${this.state.hideGandalf ? "hide-gandalf" : ""}`} autoPlay>
                            <source src={require('../images/notpass.mp4')} type="video/mp4" />
                            {/* src={require('../images/notpass.mp4')} */}
                        </video>
                    }
                    {this.state.startCountingBoom &&
                        <h3 className="counting-title">Odbrojavanje do potpunog uništenja Vašeg računara</h3>
                    }
                    {this.state.startCountingBoom &&
                        <h3 className="counting-title-2">Buuuuahahahahhhahahahaha</h3>
                    }
                </div>
                {
                    this.state.startCountingBoom && (this.state.counter !== 0) &&
                    <h2 className="counter">{this.state.counter}</h2>
                }
                {/* {this.state.boom && */}
                <div className="boom-container row">
                    {this.state.bombsFilds}
                </div>
                {/* } */}
            </Modal >
        )
    }
}

export default MeltingComponent;