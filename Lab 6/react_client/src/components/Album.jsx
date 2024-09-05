import React, {useState} from "react";
import './App.css'
import { useQuery } from "@apollo/client";
import queries from '../queries.js'
import DeleteAlbumModal from "./DeleteAlbumModal.jsx";
import EditAlbumModal from "./EditAlbumModal.jsx";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function Album(){
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteAlbum, setDeleteAlbum] = useState(null);
    const [editAlbum, setEditAlbum] = useState(null)
    const {id} = useParams()
    const {loading, error, data} = useQuery(queries.GET_ONE_ALBUM, { 
        variables: {id}
    });
    
    const handleOpenEditModal = (album) => {
        setShowEditModal(true);
        setEditAlbum(album)
    }
    const handleOpenDeleteModal = (album) => {
        setShowDeleteModal(true);
        setDeleteAlbum(album);
    };

    const handleCloseModals = () => {
        setShowDeleteModal(false);
        setShowEditModal(false);
    };
    

    

    if(data){
        const album = data.getAlbumById;
        
        return (
        <div>
            <div className="card" key={album._id}>
                <div className="card-body">
                    <h5 className="card-title">
                        {album.title}
                    </h5>
                    By: <Link to ={`/artists/${album.artist._id}`}>
                            {album.artist.name} 
                        </Link>
                    <br></br>
                    Genre: {album.genre}
                    <br></br>
                    Date Released: {album.releaseDate}
                    <br></br>
                    Songs: {album.songs.join(", ")}
                    <br></br>
                    Published by: <Link to ={`/companies/${album.recordCompany._id}`}>
                        {album.recordCompany.name}
                        </Link>
                    <br></br>
                    <button
                        className="button"
                        onClick={() =>{
                            handleOpenEditModal(album)
                        }}
                    >
                    Edit
                    </button>
                    <button
                        className="button"
                        onClick={()=> {
                            handleOpenDeleteModal(album)
                        }}
                    >
                    Delete
                    </button>
                    <br></br>
                </div>
            </div>        
                {showEditModal && (
                    <EditAlbumModal
                        isOpen={showEditModal}
                        editAlbum={editAlbum}
                        handleClose={handleCloseModals}    
                    />
                )}
                {showDeleteModal && (
                    <DeleteAlbumModal
                        isOpen={showDeleteModal}
                        handleClose={handleCloseModals}
                        deleteAlbum={deleteAlbum}
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

export default Album;