import React, {
  Component
} from 'react';
import MdPersonAdd from 'react-ionicons/lib/MdPersonAdd';
import IosPeopleOutline from 'react-ionicons/lib/IosPeopleOutline';
import IosOptions from 'react-ionicons/lib/IosOptions';

import LogIn from "../Components/LogIn";
import Filters from "../Components/Filters";
import AddNewStudentModal from './AddNewStudentModal';
import AddNewClassModal from "./AddNewClassModal";
import NewStudentCreatedSuccessfullyModal from "./NewStudentCreatedSuccessufullyModal";
import StudentDetailsModal from "./StudentDetailsModal";
import StudentiByFirm from "./StudentiByFirma";
import getStudents from "../webhooks/getStudents";
import getFirms from "../webhooks/getFirms";
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
      studentiForRender: [],
      studentZaDetaljeModal: {},
      showStudentDetailsModal: false,
      slectedStudentMaticniBroj: "",
      showAddNewFirm: false,
      imeZaPretragu: "",
      listStudenti: true,
      listFirme: false,
      firmeAll: [],
      selectedFirmaForFilter: "",
      showFirmeFilter: true,
      showStudentiFilter: false,
      isLoggedIn: "xxx",
    }
  }

  secretKey = (qwe) => {
    sessionStorage.setItem('hijeroglif', qwe);
    this.setState ({
      isLoggedIn: qwe
    })
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

  getAndSetFirms = () => {
    getFirms().then((response) => {
      let firmeSortedByName = response;
      firmeSortedByName.sort(function (a, b) {
        let firmaA = a.nazivKompanije.toLowerCase();
        let firmaB = b.nazivKompanije.toLowerCase();
        if (firmaA < firmaB) return -1;
        if (firmaA > firmaB) return 1;
        return 0
      })
      this.setState({
        firmeAll: firmeSortedByName,
      })
    })
  }

  orderFirmsByAlphabet = () => {
    let firmeSortedByName = this.state.firmeAll;
    firmeSortedByName.sort(function (a, b) {
      let firmaA = a.nazivKompanije.toLowerCase();
      let firmaB = b.nazivKompanije.toLowerCase();
      if (firmaA < firmaB) return -1;
      if (firmaA > firmaB) return 1;
      return 0
    })
    this.setState({
      firmeAll: firmeSortedByName,
    })
  }

  orderFirmsByNumberOfStudents = () => {
    let firmeAll = this.state.firmeAll.map((firma) => {
      let firmaStudentCounter = 0;
      this.state.studentiAll.forEach((student) => {
        if (student.pozicije !== undefined) {
          for (let i = 0; i < student.pozicije.length; i++) {
            if (student.pozicije[i].firma == firma.nazivKompanije) {
              firmaStudentCounter++;
              break;
            }
          }
        }
      })
      firma = {
        ...firma,
        brojStudenata: firmaStudentCounter
      }
      return firma
    });

    let firmeSortedByNumOfStudents = firmeAll;
    firmeSortedByNumOfStudents.sort(function (a, b) {
      let firmaA = a.brojStudenata;
      let firmaB = b.brojStudenata;
      if (firmaA < firmaB) return 1;
      if (firmaA > firmaB) return -1;
      return 0
    })
    this.setState({
      firmeAll: firmeSortedByNumOfStudents
    })
  }

checkLoggingKey = () => {
  const qwe = sessionStorage.getItem('hijeroglif');
  console.log(qwe)
  if (qwe !== null) {
    this.setState({
      isLoggedIn: qwe
    })
  }
}
  componentDidMount() {
    this.checkLoggingKey();
    this.getStudentsFromStudenti();
    this.getAndSetFirms();
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
    } else if (prevState.firmeAll !== this.state.firmeAll) {
      this.selectFirmaForFilter()
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
    if (this.state.studentiForRender[0] !== undefined) {
      const imeZaPretragu = this.state.imeZaPretragu.toLowerCase();
      return this.state.studentiForRender.map((student) => {
        const imeIprezime = `${student.ime.toLowerCase()} ${student.prezime.toLowerCase()}`;
        if (imeIprezime.includes(imeZaPretragu)) {
          return <BitManCard key={student.maticniBroj}
            data={student}
            openStudentDetailsModal={this.openStudentDetailsModal} />
        }
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


    //--- FILTER VESTINE ---//

    if (filterVestinePropertyNames.length > 0) {
      let studentiForRenderMezzanine = studentiForRender;
      studentiForRender = [];
      const filterVestine = [];
      const propertiesValues = Object.values(filters.vestine);
      const checkIfTrueValue = propertiesValues.indexOf(true);
      if (checkIfTrueValue !== -1) {
        filterVestinePropertyNames.forEach((propertyName) => {
          if (filters.vestine[propertyName]) {
            filterVestine.push(propertyName)
          }
        })
        studentiForRenderMezzanine.forEach(student => {
          let studentVestineCounter = 0;
          if (student.vestine) {
            for (let i = 0; i < filterVestine.length; i++) {
              if (student.vestine.indexOf(filterVestine[i]) !== -1) {
                studentVestineCounter++
              }
            }
            if (studentVestineCounter == filterVestine.length) {
              studentiForRender.push(student)
            }
          }
        })
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



  //----- FIRME VIEW -----//

  selectFirmaForFilter = (event) => {
    if (event !== undefined) {
      event.preventDefault();
      const selectedFirmaNaziv = event.target.getAttribute("data-firma");
      this.state.firmeAll.forEach((firma) => {
        if (selectedFirmaNaziv == firma.nazivKompanije) {
          this.setState({
            selectedFirmaForFilter: firma
          })

        }
      })
    } else if (this.state.selectedFirmaForFilter !== "") {
      let firma = ""
      const firmeAll = this.state.firmeAll
      for (let i = 0; i < firmeAll.length; i++) {
        if (firmeAll[i]._id.$oid == this.state.selectedFirmaForFilter._id.$oid) {
          firma = firmeAll[i]
          break;
        }
      }
      this.setState({
        selectedFirmaForFilter: firma
      })
    }
  }

  mapFirmeForSelect = () => {
    if (!this.state.imeZaPretragu) {
      return this.state.firmeAll.map((firma) => {
        return <button type="button" className={`btn d-flex justify-content-between firma-filter-button ${firma.nazivKompanije == this.state.selectedFirmaForFilter.nazivKompanije ? "btn-outline-dark" : "btn-light"}`} data-firma={`${firma.nazivKompanije}`} onClick={this.selectFirmaForFilter}>{firma.nazivKompanije}<div>{firma.brojStudenata}</div></button>
      })
    } else {
      const imeZaPretragu = this.state.imeZaPretragu.toLowerCase();
      return this.state.firmeAll.map((firma) => {
        const nazivFirme = firma.nazivKompanije.toLowerCase();
        if (nazivFirme.includes(imeZaPretragu)) {
          return <button type="button" className={`btn d-flex justify-content-between firma-filter-butto ${firma.nazivKompanije == this.state.selectedFirmaForFilter.nazivKompanije ? "btn-outline-dark" : "btn-light"}`} data-firma={`${firma.nazivKompanije}`} onClick={this.selectFirmaForFilter}>{firma.nazivKompanije}<span>{firma.brojStudenata}</span></button>
        }
      })
    }
  }


  setPretragaValue = (event) => {
    this.setState({
      imeZaPretragu: event.target.value,
      selectedFirmaForFilter: ""
    })
  }

  toggleView = () => {
    this.setState({
      listStudenti: !this.state.listStudenti,
      listFirme: !this.state.listFirme,
      imeZaPretragu: ""
    })
  }

  toggleFirmeFilter = () => {
    this.setState({
      showFirmeFilter: !this.state.showFirmeFilter
    })
  }
  toggleStudentiFilter = () => {
    this.setState({
      showStudentiFilter: !this.state.showStudentiFilter
    })
  }

  closeFilters = () => {
    this.setState({
      showFirmeFilter: false,
      showStudentiFilter: false
    })
  }

  render() {

    return (
      <div>
        {this.state.isLoggedIn.length !== 42 &&
          <LogIn secretKey={this.secretKey} />
        }

        {this.state.isLoggedIn.length == 42 &&
          <div className="p-5">
            <div className="application-buttons-container d-flex align-items-center justify-content-between">

              <div className="application-buttons-wrapper-left d-flex justify-content-around">
                <MdPersonAdd onClick={this.openNewBitManModal}
                  color="#8D1717"
                  fontSize="2.4vw"
                  className="add-new-student-icon" />

                <button type="button"
                  className="btn btn-light"
                  onClick={this.openAddNewClassModal} >
                  Dodaj novu klasu polaznika </button>
                <button type="button" className="btn btn-light"
                  onClick={this.openAddNewFirm} >
                  Dodaj novu kompaniju</button>
              </div>

              <button type="button" className="btn btn-light application-buttons-wrapper-right"
                onClick={this.toggleView} >
                Promeni prikaz na {this.state.listFirme ? "BIT Alumni" : "BIT partnerske kompanije"}</button>
            </div>

            <AddNewStudentModal visible={this.state.addNewStudentModal}
              closeNewBitManModal={this.closeNewBitManModal}
              newStudentCreatedSuccessfullyModal={this.newStudentCreatedSuccessfullyModal} />

            <AddNewClassModal visible={this.state.addNewClassModal}
              closeAddNewClassModal={this.closeAddNewClassModal} />

            <AddNewFirmModal visible={this.state.showAddNewFirm}
              closeAddNewFirm={this.closeAddNewFirm} />
            <NewStudentCreatedSuccessfullyModal visible={this.state.newStudentCreatedSuccessfully}
              closeNewStudentCreatedSuccessufullyModal={this.closeNewStudentCreatedSuccessufullyModal} />
            <StudentDetailsModal data={this.state.studentZaDetaljeModal}
              visible={this.state.showStudentDetailsModal}
              closeStudentDetailsModal={this.closeStudentDetailsModal}
              getStudentsFromStudenti={this.getStudentsFromStudenti} />



            {/* ----- STUDENTI VIEW ----- */}

            {this.state.listStudenti &&
              <div>
                <IosOptions color="#8D1717" fontSize="2.4vw" onClick={this.toggleStudentiFilter} className="firme-burger-menu" />
                <input className="search-bar student-search-bar" type="text" placeholder="Pretraga studenata po imenu" value={this.state.imeZaPretragu} onChange={this.setPretragaValue} />
                <div className={`studenti-filters-container d-flex flex-column ${this.state.showStudentiFilter ? "enter-filters" : "exit-filters"}`}>
                  <Filters filterStudentsForRendering={this.filterStudentsForRendering} />
                </div>
                <div className="d-flex justify-content-around" onClick={this.closeFilters}>
                  {!this.state.imeZaPretragu &&
                    <div className="d-flex flex-column align-items-center ime-prezime-modal-header">
                      <div><i>Ukupan broj BIT studenata:</i></div>
                      <div><b>{this.state.studentiForRender.length}</b></div>
                    </div>}
                </div>
                <div className="bit-people-cars-container d-flex justify-content-around row" onClick={this.closeFilters}> {this.mapStudentsForRender()}
                </div>
              </div>}


            {/* ----- FIRME VIEW ----- */}
            {this.state.listFirme &&
              <div>
                <IosOptions color="#8D1717" fontSize="2.4vw" onClick={this.toggleFirmeFilter} className="firme-burger-menu" />
                <div className={`firm-filters-container d-flex flex-column ${this.state.showFirmeFilter ? "enter-filters" : "exit-filters"}`}>
                  <input className="search-bar" type="text" placeholder="Pretraga kompanija po imenu" value={this.state.imeZaPretragu} onChange={this.setPretragaValue} />
                  <div className="d-flex justify-content-around">
                    <button type="button" className="btn btn-light" onClick={this.orderFirmsByAlphabet}>A-Z</button>
                    <button type="button" className="btn btn-light" onClick={this.orderFirmsByNumberOfStudents} ><IosPeopleOutline fontSize="2vw" /></button>
                  </div>
                  <div className="btn-group firme-filters-container d-flex flex-column" role="group" aria-label="Basic example">
                    {this.mapFirmeForSelect()}
                  </div>
                </div>
                {this.state.selectedFirmaForFilter &&
                  <StudentiByFirm getAndSetFirms={this.getAndSetFirms} selectedFirmaForFilter={this.state.selectedFirmaForFilter} studentiAll={this.state.studentiAll} openStudentDetailsModal={this.openStudentDetailsModal} closeFilters={this.closeFilters} />
                }
              </div>
            }
          </div>
        }

      </div >

    );
  }
}

export default App;