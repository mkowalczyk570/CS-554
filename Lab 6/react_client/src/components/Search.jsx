import React, { useState } from "react";
import './App.css'
import { useQuery, useLazyQuery } from "@apollo/client";
import queries from '../queries.js'
import { Link } from "react-router-dom";
const Search = () => {
    const [searchState, setSearchState] = useState(false)
    const [getByName, {loading : nameLoading, error: nameError, data: nameData}] = useLazyQuery(queries.GET_ARTIST_BY_NAME)
    const [getByGenre, {loading : genreLoading, error: genreError, data: genreData}] = useLazyQuery(queries.GET_ALBUM_BY_GENRE)
    const [getByYear, {loading: yearLoading, error: yearError, data:yearData}] = useLazyQuery(queries.GET_COMPANY_BY_YEAR)
    const handleNameSubmit = (e) =>{
        e.preventDefault();
        getByName({
            variables: {searchTerm: e.target.searchTerm.value}
        })
    }
    const handleGenreSubmit = (e) =>{
        e.preventDefault();
        getByGenre({
            variables: {genre: e.target.genre.value.toUpperCase()}
        })
    }
    const handleYearSubmit = (e) =>{
        e.preventDefault();
        if(!e.target.min.value){
            e.target.min.value = 1900
        }
        getByYear({
            variables: {min: parseInt(e.target.min.value), max: parseInt(e.target.max.value)}
        })
    }
    if (searchState === false){
    return (
        <div>
            <button
            className="button"
            onClick={() => setSearchState("companyByYear")}>
            Companies Founded by Year
            </button>
            <button
            className="button"
            onClick={() => setSearchState("artistByName")}>
            Artist by Name
            </button>
            <button
            className="button"
            onClick={() => setSearchState("albumsByGenre")}>
            Albums by Genre
            </button>
        </div>
        )
    }

    if(searchState === "companyByYear"){

        return(
            <div>
            <h1>Companies Founded By Year</h1>
            <form className="form" onSubmit={handleYearSubmit}>
              <label>
                Min Year:
                <br />
                <input type="text" name="min" />
              </label>
              <br></br>
              <label>
                Max Year:
                <br />
                <input type="text" name="max" />
              </label>
              <input type="submit" />
            </form>
            {yearData && (
              <div className="card">
                <div className="card-body">
                  {yearData.companyByFoundedYear.map((company) => (
                    <div key={company._id}>
                        <h5 className="card-title">
                            <Link to ={`/companies/${company._id}`}>
                                    {company.name}
                            </Link>
                        </h5>
                      Year Founded: {company.foundedYear}
                      <br></br>
                      Country of Origin: {company.country}
                      <br></br>
                      Number of Albums: {company.albums.length}
                      <br></br>
                      Albums: {company.albums.map((album) => (
                        <ul>
                            <li key={album._id}>
                            <Link to ={`/albums/${album._id}`}>
                                {album.title}
                            </Link>
                            </li>
                        </ul>
                    ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button className="button" onClick={() => setSearchState(false)}>
              Back to Search
            </button>
          </div>
        )
    }
    else if(searchState === "artistByName"){
        return(
            <div>
            <h1>Artist by Name</h1>
            <form className="form" onSubmit={handleNameSubmit}>
              <label>
                Search Term:
                <br />
                <input type="text" name="searchTerm" />
              </label>
              <input type="submit" />
            </form>
            {nameData && (
            <div>
              <div className="card">
                <div className="card-body">
                  {nameData.searchArtistByArtistName.map((artist) => (
                    <div key={artist._id}>
                        <h5 className="card-title">
                        <Link to ={`/artists/${artist._id}`}>
                                    {artist.name}
                        </Link>
                        </h5>
                      Members: {artist.members.join(", ")}
                      <br></br>
                      Date Formed: {artist.dateFormed}
                      <br></br>
                      Number of albums: {artist.albums.length}
                      <br></br>
                      Albums: {artist.albums.map((album) => (
                        <ul>
                            <li key={album._id}>
                            <Link to ={`/albums/${album._id}`}>
                                {album.title}
                            </Link>
                            </li>
                        </ul>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )}
                <button
                className="button"
                onClick={() => setSearchState(false)}>
                    Back to Search
                </button>
            </div>
        )
    }else if (searchState === "albumsByGenre") {
        return (
          <div>
            <h1>Albums By Genre</h1>
            <form className="form" onSubmit={handleGenreSubmit}>
              <label>
                Genre:
                <br />
                <input type="text" name="genre" />
              </label>
              <input type="submit" />
            </form>
            {genreData && (
              <div className="card">
                <div className="card-body">
                  {genreData.albumsByGenre.map((album) => (
                    <div key={album._id}>
                    <Link to ={`/albums/${album._id}`}>
                                    {album.title}
                    </Link>
                      Artist: <Link to ={`/artists/${album.artist._id}`}>
                                {album.artist.name}
                        </Link>
                    <br></br>
                    Genre: {album.genre}
                    <br></br>
                    Record Company: <Link to ={`/companies/${album.recordCompany._id}`}>
                                {album.recordCompany.name}
                            </Link>
                    <br></br>
                      Release Date: {album.releaseDate}
                      <br></br>
                      Songs: {album.songs.join(", ")}
                      <br></br>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button className="button" onClick={() => setSearchState(false)}>
              Back to Search
            </button>
          </div>
        );
      }
    
}

export default Search
