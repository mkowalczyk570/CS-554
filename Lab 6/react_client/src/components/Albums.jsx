import React, {useState} from "react";
import './App.css'
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import queries from '../queries.js'
import DeleteAlbumModal from "./DeleteAlbumModal.jsx";
import EditAlbumModal from "./EditAlbumModal.jsx";
import Add from "./Add.jsx";
function Albums(){
    const [showAddForm, setShowAddForm] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [deleteAlbum, setDeleteAlbum] = useState(null);
    const [editAlbum, setEditAlbum] = useState(null)
    
    const {loading, error, data} = useQuery(queries.GET_ALBUMS, {
        fetchPolicy: 'cache-and-network'
    });
    
    const handleOpenEditModal = (album) => {
        setShowEditModal(true);
        setEditAlbum(album)
    }
    const handleOpenDeleteModal = (album) => {
        setShowDeleteModal(true);
        setDeleteAlbum(album);
    };
    const closeAddFormState = () => {
        setShowAddForm(false)
    }
    const handleCloseModals = () => {
        setShowDeleteModal(false);
        setShowEditModal(false);
    };
    

    

    if(data){
        const {albums} = data;
        return (
            <div>
                <button className="button" onClick={() => setShowAddForm(!(showAddForm))}>
                    Create Album
                </button>
                {showAddForm && (
                    <Add type='album' closeAddFormState={closeAddFormState}/>
                )}
                <br></br>
                <br></br>
                {albums.map((album) =>{
                    return(
                        <div className="card" key={album._id}>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <Link to ={`/albums/${album._id}`}>
                                    {album.title}
                                    </Link>
                                </h5>
                                By: <Link to ={`/artists/${album.artist._id}`}>
                                    {album.artist.name}
                                    </Link>
                                <br></br>
                                Genre: {album.genre}
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
                    )
                })}
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

export default Albums;