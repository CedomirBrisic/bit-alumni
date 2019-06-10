import React, { Component } from 'react';
import MdAddCircle from 'react-ionicons/lib/MdAddCircle';
import updatePaymentsAtStudent from "../webhooks/updatePlacanjeAtStudent"

class StudentPlacanje extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddNewPayment: false,
            newPaymentDate: "",
            newPaymentAmount: "",
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

    toggleAddNewPayment = () => {
        this.setState({
            showAddNewPayment: !this.state.showAddNewPayment
        })
    }

    setPaymentDate = (event) => {
        const date = new Date(event.target.value)
        this.setState({
            newPaymentDate: date
        })
    }

    setPaymentAmount = (event) => {
        this.setState({
            newPaymentAmount: parseInt(event.target.value, 10)
        })
    }

    sendPayment = () => {
        const humanReadPaymentDate = this.humanReadDate(this.state.newPaymentDate);
        let paymentsToSend = [];
        const newPayment = {
            date: humanReadPaymentDate,
            amount: this.state.newPaymentAmount
        }
        if (this.props.studentData.payments) {
            paymentsToSend = this.props.studentData.payments;
            paymentsToSend.push(newPayment);
        } else {
            paymentsToSend[0] = newPayment;
        }

        const data = {
            maticniBroj: this.props.studentData.maticniBroj,
            payments: paymentsToSend
        }
        updatePaymentsAtStudent(data).then((response) => {
                this.props.getStudentsFromStudenti();
                this.setState({
                    showAddNewPayment: false,
                })
        }).catch((error) => {
            alert(error)
        })
    }

    displayPayments = () => {
        if (this.props.studentData.payments) {
            return this.props.studentData.payments.map((payment) => {
                const output =
                    <div className=" w-100 d-flex justify-content-between">
                        <div className="payment-datum">{payment.date}</div>
                        <div className="payment-vrednost">{payment.amount.$numberInt} EUR</div>
                    </div>
                return output;
            })
        } else {
            return <div className="payment-vrednost">Nema evidentiranih uplata</div>
        }
    }
    displaySummaSummarum = () => {
        if (this.props.studentData.payments) {

            let summaSummarum = null;
            this.props.studentData.payments.forEach((payment) => {
                summaSummarum += parseInt(payment.amount.$numberInt, 10)
            })
            summaSummarum = this.props.studentData.kursPrice.$numberInt - summaSummarum
            if (summaSummarum === 0){
                summaSummarum = "Zilch"
            }
            return `${summaSummarum} EUR`
        } else if (this.props.studentData.kursPrice){
            return this.props.studentData.kursPrice
        } else {
            return "Zilch"
        }
    }

    render() {
        return (
            <div className="student-placanje-container d-flex flex-column">
                {this.props.studentData.kursPrice &&
                    <div>
                        <div className="d-flex justify-content-between student-placanja-ukupno">
                            <span className="student-detail-card-attribute">
                                Ukupno za uplatu:
                            </span>
                            <span className="student-detail-card-data-placanje d-flex justify-content-end">
                                <span className="d-flex flex-column">
                                    {this.props.studentData.kursPrice.$numberInt} EUR
                                </span>
                            </span>
                        </div>
                        <div>
                            <div className="d-flex justify-content-between">
                                <span className="student-detail-card-attribute">
                                    Uplaćeno:
                                </span>
                                <span className="student-detail-card-data-placanje w-100 d-flex flex-column" >
                                    {this.displayPayments()}
                                </span>
                            </div>
                            {this.state.showAddNewPayment &&
                                <div className="add-new-payment-container">
                                    <div>
                                        <label className="new-payment-label" htmlFor="add-new-payment-date">Datum uplate:</label>
                                        <input type="date" id="add-new-payment-date" onChange={this.setPaymentDate} />
                                    </div>
                                    <div>
                                        <label className="new-payment-label" htmlFor="add-new-payment-amount">Iznos uplate (EUR):</label>
                                        <input type="number" id="add-new-payment-amount" value={this.state.newPaymentAmount} onChange={this.setPaymentAmount} />
                                    </div>
                                    <div className={`add-sertifikat-buttons-container w-100 d-flex justify-content-around enter-firma-edit`}>
                                        <button className="btn btn-warning text-success" onClick={this.toggleAddNewPayment}>Ništa, nema veze...</button>
                                        <button className="btn btn-success" onClick={this.sendPayment}>Potvrdi</button>
                                    </div>
                                </div>
                            }
                            {!this.state.showAddNewPayment &&
                                <MdAddCircle color="#8D1717" fontSize="1.6vw" className="open-edit add-new-payment" onClick={this.toggleAddNewPayment} />
                            }
                        </div>
                        <div className="d-flex justify-content-between student-detail-card-data-placanje-total-wrapper">
                            <span>
                                Summa Summarum:
                            </span>
                            <span>
                                {this.displaySummaSummarum()}
                            </span>
                        </div>
                    </div>
                }
                {!this.props.studentData.kursPrice &&
                    <div className="student-detail-card-data-placanje-total">
                        Nema detaljnijih informacija
                </div>
                }
            </div>
        )
    }
}

export default StudentPlacanje;