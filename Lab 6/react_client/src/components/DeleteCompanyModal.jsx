import React, {useState} from 'react'
import './App.css'
import { useMutation } from '@apollo/client'
import ReactModal from 'react-modal'
import { useNavigate } from 'react-router-dom'
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

function DeleteCompanyModal(props){
    const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
    const [company, setCompany] = useState(props.deleteCompany);

    const [removeCompany] = useMutation(queries.DELETE_COMPANY, {
        update(cache){
            cache.modify({
                fields: {
                    companies(existingCompanies, {readField}){
                        return existingCompanies.filter(
                            (empRef) => company._id !== readField('_id', empRef)
                        )
                    }
                }
            })
        }
    })
    const navigate = useNavigate()
    const refresh = () => {
        const path = "/companies/"
        navigate(path)        
    }
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setCompany(null);
        props.handleClose();
    }
  
      
    return (
        <div>
            <ReactModal
            name='deleteModal'
            isOpen={showDeleteModal}
            contentLabel = 'Delete Company'
            style={customStyles}
            >
            <div>
                <p>
                    Are you sure you want to delete {company.name}?
                </p>
                <form
                className='form'
                id='delete-company'
                onSubmit={(e) =>{
                    e.preventDefault();
                    removeCompany({
                        variables:{
                            id: company._id
                        }
                    })
                    setShowDeleteModal(false)
                    alert('Company Deleted (you may need to reload the page for changes to take effect)')
                    props.handleClose();
                }}
                >
                    <br></br>
                    <br></br>
                    <button className='button add-button' type='submit' onClick={refresh}>
                        Delete Company
                    </button>
                </form>
            </div>

            <br></br>
            <br></br>
            <button className='button clancel-button' onClick={handleCloseDeleteModal}>
                Cancel
            </button>
            </ReactModal>
        </div>
    )
}

export default DeleteCompanyModal