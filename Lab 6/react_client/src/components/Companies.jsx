import React, {useState} from "react";
import './App.css'
import { useQuery } from "@apollo/client";
import queries from '../queries.js'
import DeleteCompanyModal from "./DeleteCompanyModal.jsx";
import EditCompanyModal from "./EditCompanyModal.jsx";
import { Link } from "react-router-dom";
import Add from "./Add.jsx";
function Companies(){
    const [showAddForm, setShowAddForm] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [deleteCompany, setDeleteCompany] = useState(null);
    const [editCompany, setEditCompany] = useState(null)
    
    const {loading, error, data} = useQuery(queries.GET_COMPANIES, {
        fetchPolicy: 'cache-and-network'
    });
    let companies
    const handleOpenEditModal = (company) => {
        setShowEditModal(true);
        setEditCompany(company)
    }
    const handleOpenDeleteModal = (company) => {
        setShowDeleteModal(true);
        setDeleteCompany(company);
    };

    const handleCloseModals = () => {
        setShowDeleteModal(false);
        setShowEditModal(false);
    };
    const closeAddFormState = () => {
        setShowAddForm(false)
    }

    

    if(data){
        companies = data.recordCompanies;
        return (
            <div>
                <button className="button" onClick={() => setShowAddForm(!(showAddForm))}>
                    Create Record Company
                </button>
                {showAddForm && (
                    <Add type='company' closeAddFormState={closeAddFormState}/>
                )}
                <br></br>
                <br></br>
                {companies.map((company) =>{
                    const numAlbums = company.albums.length
                    return(
                        <div className="card" key={company._id}>
                            <div className="card-body">
                                <h5 className="card-title">
                                <Link to ={`/companies/${company._id}`}>
                                {company.name}
                                </Link>
                                </h5>
                                Country of origin: {company.country}
                                <br></br>
                                Number of albums: {numAlbums}
                                <br></br>
                                <button
                                    className="button"
                                    onClick={() =>{
                                        handleOpenEditModal(company)
                                    }}
                                >
                                Edit
                                </button>
                                <button
                                    className="button"
                                    onClick={()=> {
                                        handleOpenDeleteModal(company)
                                    }}
                                >
                                Delete
                                </button>
                                <br></br>
                            </div>
                        </div>
                    )
                })}
                {showEditModal && (
                    <EditCompanyModal
                        isOpen={showEditModal}
                        editCompany={editCompany}
                        handleClose={handleCloseModals}    
                    />
                )}
                {showDeleteModal && (
                    <DeleteCompanyModal
                        isOpen={showDeleteModal}
                        handleClose={handleCloseModals}
                        deleteCompany={deleteCompany}
                    />
                )}
            </div>
        )
    }else if (loading) {
        return <div>Loading</div>
    }else if (error) {
        return <div>{error.message}</div>
    }
}

export default Companies;