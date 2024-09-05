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

function EditAlbumModal(props){
    const [showEditModal, setShowEditModal]= useState(props.isOpen);
    const [album, setAlbum] = useState(props.editAlbum);
    const { loading: companyLoading, error: companyError, data: companyData } = useQuery(queries.GET_COMPANIES);
    const { loading: artistLoading, error: artistError, data: artistData } = useQuery(queries.GET_ARTISTS);
    const [editAlbum] = useMutation(queries.EDIT_ALBUM);
    let artists, companies
    const handleCloseEditModal = () =>{
        setShowEditModal(false);
        setAlbum(null);
        props.handleClose();
    }
    let albumId;
    let title;
    let releaseDate;
    let genre;
    let songs;
    let artistId;
    let companyId;

    if (companyData && artistData){
        companies = companyData.recordCompanies;
        artists = artistData.artists;
    }

    if(companyLoading || artistLoading){
        return <div>Loading...</div>
    }
    if(companyError || artistError){
        return <div>{companyError ? companyError.message : artistError.message}</div>
    }
    
    return(
        <div>
            <ReactModal
            name='editModal'
            isOpen={showEditModal}
            contentLabel='Edit Album'
            style={customStyles}
            >
                <form
                className='form'
                id='edit-album'
                onSubmit={(e) => {
                    console.log(title.value);
                    console.log(releaseDate.value)
                    console.log(genre.value);
                    console.log(songs.value);
                    console.log(artistId.value);
                    console.log(companyId.value);
                    e.preventDefault();
                    editAlbum({
                        variables: {
                            id: albumId.value,
                            title: title.value,
                            releaseDate: releaseDate.value,
                            genre: genre.value,
                            songs: songs.value.split(","),
                            artistId: artistId.value,
                            companyId: companyId.value
                        }
                    });
                    title.value='';
                    releaseDate.value='';
                    genre.value='';
                    songs.value='';
                    artistId.value='';
                    companyId.value='';
                    
                    setShowEditModal(false);
                    alert('Album updated');
                    props.handleClose();
                }}
                >
                    <div className='form-group'>
                        <label>
                            Title:
                            <br></br>
                        </label>
                        <input
                            ref={(node) =>{
                                title = node
                            }}
                            defaultValue={album.title}
                            autoFocus={true}
                        />
                    </div>
                    <br></br>
                    <div className='form-group'>
                        <label>
                            Release Date:
                            <br></br>
                        </label>
                        <input
                            ref={(node) =>{
                                releaseDate = node
                            }}
                            defaultValue={album.releaseDate}
                            autoFocus={true}
                        />
                    </div>
                    <br></br>
                    <div className='form-group'>
                        <label>
                            Genre:
                            <br></br>
                        </label>
                        <input
                            ref={(node) =>{
                                genre = node
                            }}
                            defaultValue={album.genre}
                            autoFocus={true}
                        />
                    </div>
                    <br></br>
                    <div className='form-group'>
                        <label>
                            Songs (please seperate with commas and no spaces):
                            <br></br>
                        </label>
                        <input
                            ref={(node) =>{
                                songs = node
                            }}
                            defaultValue={album.songs.join(",")}
                            autoFocus={true}
                        />
                    </div>
                    <br></br>
                    <div className='form-group'>
                        <label>
                            Artist Id:
                            <select
                            defaultValue={album.artistId}
                            className='form-control'
                            ref={(node) =>{
                                artistId = node;
                            }}
                            >
                            {artists &&
                            artists.map((artist) => {
                                return (
                                    <option key={artist._id} value = {artist._id}>
                                        {artist.name}
                                    </option>
                                )
                            })}
                            </select>
                        </label>
                    </div>
                    <br></br>
                    <div className='form-group'>
                        <label>
                            Company Id:
                            <select
                            defaultValue={album.companyId}
                            className='form-control'
                            ref={(node) =>{
                                companyId = node;
                            }}
                            >
                            {companies &&
                            companies.map((company) => {
                                return (
                                    <option key={company._id} value ={company._id}>
                                        {company.name}
                                    </option>
                                )
                            })}
                            </select>
                        </label>
                    </div>
                    <div className='form-group'>
                        <label
                        style={{display: "none"}}>
                            ID: 
                            <input
                            ref={(node) =>{
                                albumId = node
                            }}
                            defaultValue={album._id}
                        />
                        </label>
                    </div>
                    <br></br>
                    <br></br>
                    <button className='button edit-button' type='submit'>
                            Update Album
                    </button>
                </form>

                <button className='button cancel-button' onClick={handleCloseEditModal}>
                            Cancel
                </button>
            </ReactModal>
        </div>
    )
} 

export default EditAlbumModal