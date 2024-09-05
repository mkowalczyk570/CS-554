import React, {useState} from "react";
import './App.css'
import { useQuery } from "@apollo/client";
import queries from '../queries.js'
import DeleteArtistModal from "./DeleteArtistModal.jsx";
import EditArtistModal from "./EditArtistModal.jsx";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function Artist(){
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteArtist, setDeleteArtist] = useState(null);
    const [editArtist, setEditArtist] = useState(null)
    const {id} = useParams()
    const {loading, error, data} = useQuery(queries.GET_ONE_ARTIST, { 
        variables: {id}
    });
    
    const handleOpenEditModal = (artist) => {
        setShowEditModal(true);
        setEditArtist(artist)
    }
    const handleOpenDeleteModal = (artist) => {
        setShowDeleteModal(true);
        setDeleteArtist(artist);
    };

    const handleCloseModals = () => {
        setShowDeleteModal(false);
        setShowEditModal(false);
    };
    

    

    if(data){
        const artist = data.getArtistById;
        return (
        <div>
            <div className="card" key={artist._id}>
                <div className="card-body">
                    <h5 className="card-title">
                        {artist.name}
                    </h5>
                    Members: {artist.members.join(",")}
                    <br></br>
                    Date Formed: {artist.dateFormed}
                    <br></br>
                    Number of albums: {artist.albums.length}
                    <br></br>
                    Albums:
                    <ol>
                        {artist.albums.map((album) => (
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

export default Artist;