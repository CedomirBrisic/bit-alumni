import React, { Component } from 'react';
import MdPersonAdd from 'react-ionicons/lib/MdPersonAdd';
import AddNewStudentModal from './AddNewStudentModal';
import AddNewClassModal from "./AddNewClassModal";
import NewStudentCreatedSuccessfullyModal from "./NewStudentCreatedSuccessufullyModal";
import StudentDetailsModal from "./StudentDetailsModal";
import getStudents from "../webhooks/getStudents";
import BitManCard from "./BitManCard";
import AddNewFirmModal from "./AddNewFirmModal"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNewStudentModal: false,
      addNewClassModal: false,
      newStudentCreatedSuccessfully: false,
      studentiAll: [],
      studentZaDetaljeModal: {},
      showStudentDetailsModal: false,
      slectedStudentMaticniBroj: "",
      showAddNewFirm: false,
    }
  }

  openNewBitManModal = () => {
    this.setState({
      addNewStudentModal: true,
    })
  }

  closeNewBitManModal = () => {
    this.setState({
      addNewStudentModal: false,
    })
  }

  openAddNewClassModal = () => {
    this.setState({
      addNewClassModal: true,
    })
  }

  closeAddNewClassModal = () => {
    this.setState({
      addNewClassModal: false,
    })
  }

  newStudentCreatedSuccessfullyModal = () => {
    this.setState({
      newStudentCreatedSuccessfully: true
    })
  }
  closeNewStudentCreatedSuccessufullyModal = () => {
    this.getStudentsFromStudenti()
    this.setState({
      newStudentCreatedSuccessfully: false
    })
  }

  getStudentsFromStudenti = () => {
    getStudents().then((response) => {
      this.setState({
        studentiAll: response
      })
    })
  }
  componentDidMount() {
    this.getStudentsFromStudenti()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.studentiAll !== this.state.studentiAll && this.state.slectedStudentMaticniBroj) {
    const maticniBroj =this.state.slectedStudentMaticniBroj
    const studenti = this.state.studentiAll
    const studentZaDetaljeModal = studenti.find((student) => {
      return student.maticniBroj === maticniBroj
    })
      this.setState({
        studentZaDetaljeModal
      })
    }
  }


  openStudentDetailsModal = (event) => {
    const maticniBroj = event.target.getAttribute("data-maticnibroj")
    const studenti = this.state.studentiAll
    const studentZaDetaljeModal = studenti.find((student) => {
      return student.maticniBroj === maticniBroj
    })
    this.setState({
      studentZaDetaljeModal,
      showStudentDetailsModal: true,
      slectedStudentMaticniBroj: maticniBroj
    })
  }

  closeStudentDetailsModal = () => {
    this.setState({
      studentZaDetaljeModal: {},
      showStudentDetailsModal: false
    })
    this.getStudentsFromStudenti()
  }

  mapStudentiAll = () => {
    if (this.state.studentiAll) {
      return this.state.studentiAll.map((student) => {
        return <BitManCard key={student.maticniBroj} data={student} openStudentDetailsModal={this.openStudentDetailsModal} />
      })
    } else {
      return null
    }
  }

  openAddNewFirm = () => {
    this.setState({
      showAddNewFirm: true
    })
  }

  closeAddNewFirm = () => {
    this.setState({
      showAddNewFirm: false
    })
  }

  render() {

    return (
      <div className="p-5">
        <MdPersonAdd onClick={this.openNewBitManModal} color="#0e3572" fontSize="2.4vw" className="add-new-icon" />
        <button type="button" className="btn btn-primary ml-5" onClick={this.openAddNewClassModal}>
          Dodaj novu klasu polaznika
        </button>
        <button type="button" className="btn btn-primary ml-5" onClick={this.openAddNewFirm}>
          Dodaj novu kompaniju
        </button>
        <AddNewStudentModal visible={this.state.addNewStudentModal} closeNewBitManModal={this.closeNewBitManModal} newStudentCreatedSuccessfullyModal={this.newStudentCreatedSuccessfullyModal} />
        <AddNewClassModal visible={this.state.addNewClassModal} closeAddNewClassModal={this.closeAddNewClassModal} />
        <AddNewFirmModal visible={this.state.showAddNewFirm} closeAddNewFirm={this.closeAddNewFirm} />
        
        <NewStudentCreatedSuccessfullyModal visible={this.state.newStudentCreatedSuccessfully} closeNewStudentCreatedSuccessufullyModal={this.closeNewStudentCreatedSuccessufullyModal} />
        <StudentDetailsModal data={this.state.studentZaDetaljeModal} visible={this.state.showStudentDetailsModal} closeStudentDetailsModal={this.closeStudentDetailsModal} getStudentsFromStudenti={this.getStudentsFromStudenti} />

        <div className="bit-people-cars-container d-flex justify-content-around row mt-5">
          {this.mapStudentiAll()}
        </div>
      </div>
    );
  }
}

export default App;
