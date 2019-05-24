import React, { Component } from 'react';
import IosConstruct from 'react-ionicons/lib/IosConstruct';
import DatePicker from 'react-date-picker';
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
        const months = ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"]
        const date = new Date(inputDate)
        const dd = date.getDate();
        const mm = months[date.getMonth()];
        const yy = date.getFullYear();

        return `${dd}. ${mm} ${yy}.`
    }

    mapKomunikacijaData = () => {
        return this.props.komunikacijaData.map((komunikacija) => {
            return <div>
                <div>
                    <b>{komunikacija.datum}</b>
                </div>
                <div>
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
    setSelectedDate = (date) => {
        this.setState({
            selectedDate: date
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
            if (response.status === 200 && response.ok === true) {
                this.setState({
                    showAddNewKomunikacija: false,
                })
                this.props.getStudentsFromStudenti()
            } else {
                alert(response)
            }
        })
    }

    render() {
        return (
            <div>
                <div className="mb-3">Komunikacija</div>
                {this.props.komunikacijaData &&
                    this.mapKomunikacijaData()}
                {this.state.showAddNewKomunikacija &&
                    <div>
                        Datum: <DatePicker calendarIcon={null}
                            value={this.state.selectedDate}
                            onChange={this.setSelectedDate}
                        />
                        <textarea placeholder="Komentar" rows="6" value={this.state.selectedKomentar} onChange={this.setSelectedKomentar}>

                        </textarea>
                        <button type="button" className="btn btn-success" onClick={this.dodajKomunikaciju}>
                            Dodaj
                        </button>
                    </div>
                }
                <IosConstruct color="#0e3572" fontSize="1.5vw" className="add-new-icon" onClick={this.toggleChangeKomunikacijaStatus} />
            </div>
        )
    }
}

export default Komunikacija