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

function DeleteAlbumModal(props){
    const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
    const [album, setAlbum] = useState(props.deleteAlbum);

    const [removeAlbum] = useMutation(queries.DELETE_ALBUM, {
        update(cache){
            cache.modify({
                fields: {
                    albums(existingAlbums, {readField}){
                        return existingAlbums.filter(
                            (empRef) => album._id !== readField('_id', empRef)
                        )
                    }
                }
            })
        }
    })

    const navigate = useNavigate();
    const redirect = () => {
        let path = "/albums/"
        navigate(path)
    }

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setAlbum(null);
        props.handleClose();
    }

    return (
        <div>
            <ReactModal
            name='deleteModal'
            isOpen={showDeleteModal}
            contentLabel = 'Delete Album'
            style={customStyles}
            >
            <div>
                <p>
                    Are you sure you want to delete {album.title}{' by '}
                    {album.artist.name}?
                </p>
                <form
                className='form'
                id='delete-album'
                onSubmit={(e) =>{
                    e.preventDefault();
                    removeAlbum({
                        variables:{
                            id: album._id
                        }
                    })
                    setShowDeleteModal(false)
                    alert('Album Deleted (you may need to reload the page for changes to take effect)')
                    props.handleClose();
                }}
                >
                    <br></br>
                    <br></br>
                    <button className='button add-button' type='submit' onClick={redirect}>
                        Delete Album
                    </button>
                </form>
            </div>

            <br></br>
            <br></br>
            <button className='button cancel-button' onClick={handleCloseDeleteModal}>
                Cancel
            </button>
            </ReactModal>
        </div>
    )
}

export default DeleteAlbumModal