import React, { Component } from 'react';
import MdAddCircle from 'react-ionicons/lib/MdAddCircle';
import Text from "react-format-text";
import updateStudentKomunikacija from "../webhooks/updateStudentKomunikacija";



class Komunikacija extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddNewKomunikacija: false,
            selectedDate: "",
            selectedKomentar: "",
        }
    }

    dateHumanRead = (inputDate) => {
        const months = ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "August", "Septembar", "Oktobar", "Novembar", "Decembar"]
        const date = new Date(inputDate)
        const dd = date.getDate();
        const mm = months[date.getMonth()];
        const yy = date.getFullYear();

        return `${dd}. ${mm} ${yy}.`
    }

    mapKomunikacijaData = () => {
        return this.props.komunikacijaData.map((komunikacija, index) => {
            return <div key={komunikacija.datum+index} className="single-komunikacija-container">
                <div className="komunikacija-datum">
                {komunikacija.datum}
                </div>
                <div className="komunikacija-komentar">
                    <Text>{komunikacija.komentar}</Text>
                </div>
            </div>
        })
    }

    toggleChangeKomunikacijaStatus = () => {
        const addNewKomunikacija = this.state.showAddNewKomunikacija;
        this.setState({
            showAddNewKomunikacija: !addNewKomunikacija
        })
    }
    setSelectedDate = (event) => {
        const newDate = new Date(event.target.value)
        this.setState({
            selectedDate: newDate
        })
    }
    setSelectedKomentar = (event) => {
        const value = event.target.value;
        this.setState({
            selectedKomentar: value
        })
    }

    dodajKomunikaciju = () => {

        let komunikacijeToSend = [];
        const newKomunikacija = {
            datum: this.dateHumanRead(this.state.selectedDate),
            komentar: this.state.selectedKomentar,
        }
        if (this.props.komunikacijaData) {
            komunikacijeToSend = this.props.komunikacijaData;
            komunikacijeToSend.push(newKomunikacija);
        } else {
            komunikacijeToSend[0] = newKomunikacija;
        }
        const data = {
            maticniBroj: this.props.maticniBroj,
            komunikacija: komunikacijeToSend
        }
        updateStudentKomunikacija(data).then((response) => {
                this.setState({
                    showAddNewKomunikacija: false,
                })
                this.props.getStudentsFromStudenti()

        }).catch((error) => {
            alert(error)
        })
    }
    editButtonsClasses = () => {
        if (this.state.showAddNewKomunikacija) {
            return "enter-firma-edit"
        } else {
            return "exit-firma-edit"
        }
    }

    render() {
        return (
            <div className="komunikacija-container d-flex flex-column">
                <h6 className="details-card-setion-title">Komunikacija</h6>
                <div className="section-title-horizontal-line"></div>
                {this.props.komunikacijaData &&
                    this.mapKomunikacijaData()}
                {this.state.showAddNewKomunikacija &&
                    <div>
                        Datum:
                        <input type="date" onChange={this.setSelectedDate}/>
                        <textarea placeholder="Komentar" rows="6" value={this.state.selectedKomentar} onChange={this.setSelectedKomentar}>

                        </textarea>

                        <div className={`d-flex justify-content-between ${this.editButtonsClasses()}`}>
                            <button className="btn btn-warning text-success" onClick={this.toggleChangeKomunikacijaStatus}>Ništa, nema veze...</button>
                            <button className="btn btn-success" onClick={this.dodajKomunikaciju}>Potvrdi</button>
                        </div>
                    </div>
                }
                {!this.state.showAddNewKomunikacija &&
                <MdAddCircle color="#8D1717" fontSize="2.4vw" className="add-new-icon" onClick={this.toggleChangeKomunikacijaStatus} />
                }
            </div>
        )
    }
}

export default Komunikacija