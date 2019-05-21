import React, {
  Component
} from 'react';
import MdPersonAdd from 'react-ionicons/lib/MdPersonAdd';
import Filters from "../Components/Filters";
import AddNewStudentModal from './AddNewStudentModal';
import AddNewClassModal from "./AddNewClassModal";
import NewStudentCreatedSuccessfullyModal from "./NewStudentCreatedSuccessufullyModal";
import StudentDetailsModal from "./StudentDetailsModal";
import getStudents from "../webhooks/getStudents";
import BitManCard from "./BitManCard";
import AddNewFirmModal from "./AddNewFirmModal"
import { platform } from 'os';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNewStudentModal: false,
      addNewClassModal: false,
      newStudentCreatedSuccessfully: false,
      studentiAll: [],
      studentiForRender: [],
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
        studentiAll: response,
        studentiForRender: response
      })
    })
  }
  componentDidMount() {
    this.getStudentsFromStudenti()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.studentiAll !== this.state.studentiAll && this.state.slectedStudentMaticniBroj) {
      const maticniBroj = this.state.slectedStudentMaticniBroj
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
    // this.getStudentsFromStudenti()
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

  mapStudentsForRender = () => {
    if (this.state.studentiForRender == 0) {
      return <h1>Nema studenata koji ispunjavaju zadate kriterijume</h1>
    } else if (this.state.studentiForRender[0] !== undefined) {
      return this.state.studentiForRender.map((student) => {
        return <BitManCard key={student.maticniBroj}
          data={student}
          openStudentDetailsModal={this.openStudentDetailsModal} />
      })
    }
  }




  filterStudentsForRendering = (filters) => {
    let studentiForRender = this.state.studentiAll;
    let isSelectedPohadjaniProgrami = false;

    const filterPolPropertyNames = Object.getOwnPropertyNames(filters.pol)
    const filterStatusPropertyNames = Object.getOwnPropertyNames(filters.status)
    const filterMestoPropertyNames = Object.getOwnPropertyNames(filters.mesto)
    const filterObrazovanjePropertyNames = Object.getOwnPropertyNames(filters.obrazovanje)

    const filterPozicijePropertyNames = Object.getOwnPropertyNames(filters.pozicije)

    const filterPohadjaniProgramiPropertyNames = Object.getOwnPropertyNames(filters.pohadjaniProgrami)
    const filterSertifikatiPropertyNames = Object.getOwnPropertyNames(filters.sertifikati)

    const filterVestinePropertyNames = Object.getOwnPropertyNames(filters.vestine)

    //--- FILTER POL ---//
    if (filterPolPropertyNames.length > 0) {
      let studentiForRenderMezzanine = studentiForRender;
      studentiForRender = [];
      const propertiesValues = Object.values(filters.pol);
      const checkIfTrueValue = propertiesValues.indexOf(true);
      if (checkIfTrueValue !== -1) {
        filterPolPropertyNames.forEach((propertyName) => {
          if (filters.pol[propertyName]) {
            studentiForRenderMezzanine.forEach(student => {
              if (student.pol == propertyName) {
                studentiForRender.push(student)
              }
            })
          }
        })
      } else {
        studentiForRender = studentiForRenderMezzanine;
      }
    }

    //--- FILTER STATUS ---//
    if (filterStatusPropertyNames.length > 0) {
      let studentiForRenderMezzanine = studentiForRender;
      studentiForRender = [];
      const propertiesValues = Object.values(filters.status);
      const checkIfTrueValue = propertiesValues.indexOf(true);
      if (checkIfTrueValue !== -1) {
        filterStatusPropertyNames.forEach((propertyName) => {
          if (filters.status[propertyName]) {
            studentiForRenderMezzanine.forEach(student => {
              if (student.status == propertyName) {
                studentiForRender.push(student)
              }
            })
          }
        })
      } else {
        studentiForRender = studentiForRenderMezzanine;
      }
    }

    //--- FILTER MESTO ---//
    if (filterMestoPropertyNames.length > 0) {
      let studentiForRenderMezzanine = studentiForRender;
      studentiForRender = [];
      const propertiesValues = Object.values(filters.mesto);
      const checkIfTrueValue = propertiesValues.indexOf(true);
      if (checkIfTrueValue !== -1) {
        filterMestoPropertyNames.forEach((propertyName) => {
          if (filters.mesto[propertyName]) {
            studentiForRenderMezzanine.forEach(student => {
              if (student.mesto == propertyName) {
                studentiForRender.push(student)
              }
            })
          }
        })
      } else {
        studentiForRender = studentiForRenderMezzanine;
      }
    }

    //--- FILTER OBRAZOVANJE ---//
    if (filterObrazovanjePropertyNames.length > 0) {
      let studentiForRenderMezzanine = studentiForRender;
      studentiForRender = [];
      const propertiesValues = Object.values(filters.obrazovanje);
      const checkIfTrueValue = propertiesValues.indexOf(true);
      if (checkIfTrueValue !== -1) {
        filterObrazovanjePropertyNames.forEach((propertyName) => {
          if (filters.obrazovanje[propertyName]) {
            studentiForRenderMezzanine.forEach(student => {
              if (student.obrazovanje == propertyName) {
                studentiForRender.push(student)
              }
            })
          }
        })
      } else {
        studentiForRender = studentiForRenderMezzanine;
      }
    }

    //--- FILTER POZICIJE ---//
    if (filterPozicijePropertyNames.length > 0) {
      let studentiForRenderMezzanine = studentiForRender;
      studentiForRender = [];
      const propertiesValues = Object.values(filters.pozicije);
      const checkIfTrueValue = propertiesValues.indexOf(true);
      if (checkIfTrueValue !== -1) {
        filterPozicijePropertyNames.forEach((propertyName) => {
          if (filters.pozicije[propertyName]) {
            studentiForRenderMezzanine.forEach(student => {
              let isStudentHadPoziciju = false;
              if (student.pozicije) {
                student.pozicije.forEach((pozicija) => {
                  if (pozicija.firma == propertyName) {
                    isStudentHadPoziciju = true
                  }
                })
                if (isStudentHadPoziciju) {
                  studentiForRender.push(student)
                }
              }
            })
          }
        })
      } else {
        studentiForRender = studentiForRenderMezzanine;
      }
    }


    //--- FILTER POHADJANI PROGRAMI ---//
    if (filterPohadjaniProgramiPropertyNames.length > 0) {
      let studentiForRenderMezzanine = studentiForRender;
      studentiForRender = [];
      const propertiesValues = Object.values(filters.pohadjaniProgrami);
      const checkIfTrueValue = propertiesValues.indexOf(true);
      if (checkIfTrueValue !== -1) {
        isSelectedPohadjaniProgrami = true;
        filterPohadjaniProgramiPropertyNames.forEach((propertyName) => {
          if (filters.pohadjaniProgrami[propertyName]) {
            studentiForRenderMezzanine.forEach(student => {
              let isStudentHadPohadjaniProgram = false;
              if (student.pohadjaniProgrami) {
                student.pohadjaniProgrami.forEach((pohadjaniProgram) => {
                  if (pohadjaniProgram == propertyName) {
                    isStudentHadPohadjaniProgram = true
                  }
                })
                if (isStudentHadPohadjaniProgram) {
                  studentiForRender.push(student)
                }
              }
            })
          }
        })
      } else {
        studentiForRender = studentiForRenderMezzanine;
      }
    }


    //--- FILTER SERTIFIKATI ---//

    if (filterSertifikatiPropertyNames.length > 0) {
      let studentiForRenderMezzanine = studentiForRender;
      studentiForRender = [];
      const sertifikatiFromFilterFormatted = [];
      const propertiesValues = Object.values(filters.sertifikati);
      const checkIfTrueValue = propertiesValues.indexOf(true);

      if (checkIfTrueValue !== -1) {
        if (isSelectedPohadjaniProgrami) {
          filterPohadjaniProgramiPropertyNames.forEach((pohadjaniProgramPropertyName) => {
            if (filters.pohadjaniProgrami[pohadjaniProgramPropertyName]) {
              filterSertifikatiPropertyNames.forEach((sertifikatPropertyName) => {
                if (filters.sertifikati[sertifikatPropertyName]) {
                  const formattedSertifikat = `${sertifikatPropertyName} (${pohadjaniProgramPropertyName})`;
                  sertifikatiFromFilterFormatted.push(formattedSertifikat)
                }
              })
            }
          })
          studentiForRenderMezzanine.forEach((student) => {
            if (student.sertifikati) {
              student.sertifikati.forEach((sertifikat) => {
                let srtf = sertifikat.split(" (")
                srtf = `${srtf[0].toLowerCase().split(" ").join("-")} (${srtf[1]}`
                sertifikatiFromFilterFormatted.forEach((filterSertifikat) => {
                  if (srtf == filterSertifikat) {
                    studentiForRender.push(student)
                  }
                })
              })
            }
          })

        } else {
          filterSertifikatiPropertyNames.forEach((propertyName) => {
            if (filters.sertifikati[propertyName]) {
              studentiForRenderMezzanine.forEach(student => {
                if (student.sertifikati) {
                  student.sertifikati.forEach((sertifikat) => {
                    let srtf = sertifikat.split(" (")[0].toLowerCase().split(" ").join("-");
                    if (srtf == propertyName) {
                      studentiForRender.push(student)
                    }
                  })
                }
              })
            }
          })
        }


      } else {
        studentiForRender = studentiForRenderMezzanine;
      }
    }









    const studentiForRenderDuplicatesRemoved = [];

    studentiForRender.forEach((student) => {
      const indx = studentiForRenderDuplicatesRemoved.indexOf(student);
      if (indx == -1) {
        studentiForRenderDuplicatesRemoved.push(student)
      }
    })


    this.setState({
      studentiForRender: studentiForRenderDuplicatesRemoved
    })
  }

  render() {

    return (<div className="p-5" >
      <MdPersonAdd onClick={this.openNewBitManModal}
        color="#0e3572"
        fontSize="2.4vw"
        className="add-new-icon" />

      <button type="button"
        className="btn btn-primary ml-5"
        onClick={this.openAddNewClassModal} >
        Dodaj novu klasu polaznika </button>
      <button type="button" className="btn btn-primary ml-5"
        onClick={this.openAddNewFirm} >
        Dodaj novu kompaniju/firmu</button>

      <AddNewStudentModal visible={this.state.addNewStudentModal}
        closeNewBitManModal={this.closeNewBitManModal}
        newStudentCreatedSuccessfullyModal={this.newStudentCreatedSuccessfullyModal} />

      <AddNewClassModal visible={this.state.addNewClassModal}
        closeAddNewClassModal={this.closeAddNewClassModal} />

      <AddNewFirmModal visible={this.state.showAddNewFirm}
        closeAddNewFirm={this.closeAddNewFirm} />

      <Filters filterStudentsForRendering={this.filterStudentsForRendering} />

      <NewStudentCreatedSuccessfullyModal visible={this.state.newStudentCreatedSuccessfully}
        closeNewStudentCreatedSuccessufullyModal={this.closeNewStudentCreatedSuccessufullyModal} />
      <StudentDetailsModal data={this.state.studentZaDetaljeModal}
        visible={this.state.showStudentDetailsModal}
        closeStudentDetailsModal={this.closeStudentDetailsModal}
        getStudentsFromStudenti={this.getStudentsFromStudenti} />

      <div className="bit-people-cars-container d-flex justify-content-around row mt-5" > {this.mapStudentsForRender()}
      </div>

    </div >);
  }
}

export default App;