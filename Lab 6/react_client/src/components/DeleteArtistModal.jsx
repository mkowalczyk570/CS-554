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

function DeleteArtistModal(props){
    const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
    const [artist, setArtist] = useState(props.deleteArtist);

    const [removeArtist] = useMutation(queries.DELETE_ARTIST, {
        update(cache){
            cache.modify({
                fields: {
                    artists(existingArtists, {readField}){
                        return existingArtists.filter(
                            (empRef) => artist._id !== readField('_id', empRef)
                        )
                    }
                }
            })
        }
    })

    const navigate = useNavigate();
    const redirect = () => {
        let path = "/artists/"
        navigate(path)
    }

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setArtist(null);
        props.handleClose();
    }

    return (
        <div>
            <ReactModal
            name='deleteModal'
            isOpen={showDeleteModal}
            contentLabel = 'Delete Artist'
            style={customStyles}
            >
            <div>
                <p>
                    Are you sure you want to delete {artist.name}?
                </p>
                <form
                className='form'
                id='delete-artist'
                onSubmit={(e) =>{
                    e.preventDefault();
                    removeArtist({
                        variables:{
                    id: artist._id
                        }
                    })
                    setShowDeleteModal(false)
                    alert('Artist Deleted (you may need to reload the page for changes to take effect)')
                    props.handleClose();
                }}
                >
                    <br></br>
                    <br></br>
                    <button className='button add-button' type='submit' onClick={redirect}>
                        Delete Artist
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

export default DeleteArtistModal