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

function EditArtistModal(props){
    const [showEditModal, setShowEditModal]= useState(props.isOpen);
    const [artist, setArtist] = useState(props.editArtist);
    const [editArtist] = useMutation(queries.EDIT_ARTIST);
    const handleCloseEditModal = () =>{
        setShowEditModal(false);
        setArtist(null);
        props.handleClose();
    }
    let artistId;
    let name;
    let dateFormed;
    let members;

    return(
        <div>
            <ReactModal
            name='editModal'
            isOpen={showEditModal}
            contentLabel='Edit Artist'
            style={customStyles}
            >
                <form
                className='form'
                id='edit-artist'
                onSubmit={(e) => {
                    console.log(name.value);
                    console.log(dateFormed.value)
                    console.log(members.value);
                    console.log(artistId.value);
                    e.preventDefault();
                    editArtist({
                        variables: {
                            id: artistId.value,
                            name: name.value,
                            dateFormed: dateFormed.value,
                            members: members.value.split(","),
                        }
                    });
                    artistId.value ="",
                    name.value ="",
                    dateFormed.value="",
                    members.value="",
                    
                    setShowEditModal(false);
                    alert('Artist updated');
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
                            defaultValue={artist.name}
                            autoFocus={true}
                        />
                    </div>
                    <br></br>
                    <div className='form-group'>
                        <label>
                            Date formed:
                            <br></br>
                        </label>
                        <input
                            ref={(node) =>{
                                dateFormed = node
                            }}
                            defaultValue={artist.dateFormed}
                            autoFocus={true}
                        />
                    </div>
                    <br></br>
                    <div className='form-group'>
                        <label>
                            Members (seperate with commas and no spaces):
                            <br></br>
                        </label>
                        <input
                            ref={(node) =>{
                                members = node
                            }}
                            defaultValue={artist.members.join(",")}
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
                                artistId = node
                            }}
                            defaultValue={artist._id}
                        />
                        </label>
                    </div>
                    <br></br>
                    <br></br>
                    <button className='button edit-button' type='submit'>
                            Update Artist
                    </button>
                </form>

                <button className='button cancel-button' onClick={handleCloseEditModal}>
                            Cancel
                </button>
            </ReactModal>
        </div>
    )
} 

export default EditArtistModal