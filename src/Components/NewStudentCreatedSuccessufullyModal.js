import React from 'react';
import Modal from 'react-bootstrap4-modal';



const NewStudentCreatedSuccessfullyModal = (props) => {


    return (
        <Modal visible={props.visible} onClickBackdrop={props.closeNewStudentCreatedSuccessufullyModal} fade={true} >
            <div className="modal-header">
                <h5 className="modal-title">BIT Student</h5>
            </div>
            <div className="modal-body d-flex flex-column justify-content-around">
                <div>Novi BIT polaznik je uspešno kreiran</div>
            </div>

            <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={props.closeNewStudentCreatedSuccessufullyModal}>
                    OK
              </button>
            </div>
        </Modal>
    );
}


export default NewStudentCreatedSuccessfullyModal;
