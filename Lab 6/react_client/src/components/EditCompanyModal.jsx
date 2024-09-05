import React, { useState } from 'react'
import './App.css'
import { useMutation, useQuery } from '@apollo/client'
import ReactModal from 'react-modal'

import queries from '../queries.js'

ReactModal.setAppElement('#root');
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        border: '1px solid #28547a',
        borderRadius: '4px'
    }
};

function EditCompanyModal(props){
    const [showEditModal, setShowEditModal]= useState(props.isOpen);
    const [company, setCompany] = useState(props.editCompany);
    const [editCompany] = useMutation(queries.EDIT_COMPANY);
    
    const handleCloseEditModal = () =>{
        setShowEditModal(false);
        setCompany(null);
        props.handleClose();
    }
    let companyId;
    let name;
    let foundedYear;
    let country;

    return(
        <div>
            <ReactModal
            name='editModal'
            isOpen={showEditModal}
            contentLabel='Edit Company'
            style={customStyles}
            >
                <form
                className='form'
                id='edit-company'
                onSubmit={(e) => {
                    console.log(name.value);
                    console.log(foundedYear.value)
                    console.log(companyId.value);
                    console.log(country.value)
                    e.preventDefault();
                    editCompany({
                        variables: {
                            id: company._id,
                            name: name.value,
                            foundedYear: parseInt(foundedYear.value),
                            country: country.value
                        }
                    });
                    companyId.value ="",
                    name.value ="",
                    foundedYear.value="",
                    country.value=""
                    
                    setShowEditModal(false);
                    alert('Company updated');
                    props.handleClose();
                }}
                >
                    <div className='form-group'>
                        <label>
                            Name:
                            <br></br>
                        </label>
                        <input
                            ref={(node) =>{
                                name = node
                            }}
                            defaultValue={company.name}
                            autoFocus={true}
                        />
                    </div>
                    <br></br>
                    <div className='form-group'>
                        <label>
                            Founded Year:
                            <br></br>
                        </label>
                        <input
                            ref={(node) =>{
                                foundedYear = node
                            }}
                            defaultValue={company.foundedYear}
                            autoFocus={true}
                        />
                    </div>
                    <br></br>
                    <div className='form-group'>
                        <label>
                            Country of origin: 
                            <br></br>
                        </label>
                        <input
                            ref={(node) =>{
                                country = node
                            }}
                            defaultValue={company.country}
                            autoFocus={true}
                        />
                    </div>
                    <br></br>
                    <div className='form-group'>
                        <label
                        style={{display: "none"}}>
                            ID: 
                            <input
                            ref={(node) =>{
                                companyId = node
                            }}
                            defaultValue={company._id}
                        />
                        </label>
                    </div>
                    <br></br>
                    <br></br>
                    <button className='button edit-button' type='submit'>
                            Update Company
                    </button>
                </form>

                <button className='button cancel-button' onClick={handleCloseEditModal}>
                            Cancel
                </button>
            </ReactModal>
        </div>
    )
} 

export default EditCompanyModal