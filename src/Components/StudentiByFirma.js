import React, { Component } from 'react';
import BitManCard from "./BitManCard";

class StudentiByFirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zaposleni: [],
            naPraksi: []
        }

    }

    filterStudentsForRender = () => {
        const zaposleni = [];
        const naPraksi = [];
        if (this.props.studentiAll !== undefined && this.props.selectedFirmaForFilter !== undefined) {
            this.props.studentiAll.forEach((student) => {
                student.pozicije.forEach((pozicija, index) => {
                    if (pozicija.firma == this.props.selectedFirmaForFilter) {
                        if (pozicija.status == "Zaposlen") {
                            if (index == student.pozicije.length - 1) {
                                student = {
                                    ...student,
                                    aktivnaPozicija: true,
                                }
                            }
                            zaposleni.push(student)
                        } else if (pozicija.status == "Na praksi") {
                            if (index == student.pozicije.length - 1) {
                                student = {
                                    ...student,
                                    aktivnaPozicija: true,
                                }
                            }
                            naPraksi.push(student)
                        }
                    }
                })
            });
        }


        const zaposleniRemovedDuplicates = [];
        const zaposleniMaticniBrojevi = [];
        zaposleni.forEach((student) => {
            const indx = zaposleniRemovedDuplicates.indexOf(student);
            if (indx == -1) {
                zaposleniRemovedDuplicates.push(student)
                zaposleniMaticniBrojevi.push(student.maticniBroj)
            }
        })
        const naPraksiRemovedDuplicates = [];
        const naPosluSaPrakseMaticniBrojevi = [];
        naPraksi.forEach((student) => {
            const indx = naPraksiRemovedDuplicates.indexOf(student);
            const indxmtbr = zaposleniMaticniBrojevi.indexOf(student.maticniBroj)
            if (indx == -1 && indxmtbr == -1) {
                naPraksiRemovedDuplicates.push(student)
            } else if (indxmtbr !== -1){
                naPosluSaPrakseMaticniBrojevi.push(student.maticniBroj)
            }
        })

        const zaposleniRemovedDuplicates2 = [];
        zaposleniRemovedDuplicates.forEach((student) => {
            const indx = naPosluSaPrakseMaticniBrojevi.indexOf(student.maticniBroj);
            if (indx !== -1){
                student ={
                    ...student,
                    saPrakseNaPosao: true
                }
            }
            zaposleniRemovedDuplicates2.push(student)
        })


        this.setState({
            zaposleni: zaposleniRemovedDuplicates2,
            naPraksi: naPraksiRemovedDuplicates
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.selectedFirmaForFilter !== this.props.selectedFirmaForFilter) {
            this.filterStudentsForRender()
        }
    }


    render() {
        return (
            `Hello from the other side...`
        )
    }
};

export default StudentiByFirm;

// return <BitManCard key={student.maticniBroj}
// data={student}
// openStudentDetailsModal={this.openStudentDetailsModal} />