import React, {useState} from "react";
import './App.css'
import { useQuery } from "@apollo/client";
import queries from '../queries.js'
import { Link } from "react-router-dom";
import DeleteArtistModal from "./DeleteArtistModal.jsx";
import EditArtistModal from "./EditArtistModal.jsx";
import Add from "./Add.jsx";
function Artists(){
    const [showAddForm, setShowAddForm] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [deleteArtist, setDeleteArtist] = useState(null);
    const [editArtist, setEditArtist] = useState(null)
    
    const {loading, error, data} = useQuery(queries.GET_ARTISTS, {
        fetchPolicy: 'cache-and-network'
    });
    
    const handleOpenEditModal = (artist) => {
        setShowEditModal(true);
        setEditArtist(artist)
    }
    const handleOpenDeleteModal = (artist) => {
        setShowDeleteModal(true);
        setDeleteArtist(artist);
    };

    const closeAddFormState = () => {
        setShowAddForm(false)
    }
    const handleCloseModals = () => {
        setShowDeleteModal(false);
        setShowEditModal(false);
    };
    

    

    if(data){
        const {artists} = data;
        return (
            <div>
                <button className="button" onClick={() => setShowAddForm(!(showAddForm))}>
                    Create Artist
                </button>
                {showAddForm && (
                    <Add type='artist' closeAddFormState={closeAddFormState}/>
                )}
                <br></br>
                <br></br>
                {artists.map((artist) =>{
                    return(
                        <div className="card" key={artist._id}>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <Link to ={`/artists/${artist._id}`}>
                                    {artist.name}
                                    </Link>
                                </h5>
                                Members: {artist.members.join(", ")}
                                <br></br>
                                Number of albums: {artist.numOfAlbums}
                                <br></br>
                                <button
                                    className="button"
                                    onClick={() =>{
                                        handleOpenEditModal(artist)
                                    }}
                                >
                                Edit
                                </button>
                                <button
                                    className="button"
                                    onClick={()=> {
                                        handleOpenDeleteModal(artist)
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
                    <EditArtistModal
                        isOpen={showEditModal}
                        editArtist={editArtist}
                        handleClose={handleCloseModals}    
                    />
                )}
                {showDeleteModal && (
                    <DeleteArtistModal
                        isOpen={showDeleteModal}
                        handleClose={handleCloseModals}
                        deleteArtist={deleteArtist}
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

export default Artists;