import React, {useState} from "react";
import './App.css'
import { useQuery } from "@apollo/client";
import queries from '../queries.js'
import DeleteCompanyModal from "./DeleteCompanyModal.jsx";
import EditCompanyModal from "./EditCompanyModal.jsx";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function Company(){
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteCompany, setDeleteCompany] = useState(null);
    const [editCompany, setEditCompany] = useState(null)
    const {id} = useParams()
    const {loading, error, data} = useQuery(queries.GET_ONE_COMPANY, { 
        variables: {id}
    });
    
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
    

    

    if(data){
        const company = data.getCompanyById;
        return (
        <div>
            <div className="card" key={company._id}>
                <div className="card-body">
                    <h5 className="card-title">
                        {company.name}
                    </h5>
                    Founded year: {company.foundedYear}
                    <br></br>
                    Country of origin: {company.country}
                    <br></br>
                    Number of albums: {company.numOfAlbums}
                    <br></br>
                    Albums:
                    <ol>
                        {company.albums.map((album) => (
                            <li key={album._id}>
                            <Link to ={`/albums/${album._id}`}>
                                {album.title}
                            </Link>
                            </li>
                        ))}
                    </ol>
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
                /*{showEditModal && (
                    <EditCompanyModal
                        isOpen={showEditModal}
                        editCompany={editCompany}
                        handleClose={handleCloseModals}    
                    />
                )}*/
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

export default Company;