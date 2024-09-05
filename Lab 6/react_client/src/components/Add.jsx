import React from "react";
import "./App.css";
import { useMutation, useQuery } from "@apollo/client";
import queries from "../queries";

function Add(props) {
  const [addArtist] = useMutation(queries.ADD_ARTIST, {
    update(cache, { data: { addArtist } }) {
      const { artists } = cache.readQuery({
        query: queries.GET_ARTISTS,
      });
      cache.writeQuery({
        query: queries.GET_ARTISTS,
        data: { artists: [...artists, addArtist] },
      });
    },
  });
  const [addAlbum] = useMutation(queries.ADD_ALBUM, {
    update(cache, { data: { addAlbum } }) {
      const { albums } = cache.readQuery({
        query: queries.GET_ALBUMS,
      });
      cache.writeQuery({
        query: queries.GET_ALBUMS,
        data: { albums: [...albums, addAlbum] },
      });
    },
  });
  const [addCompany] = useMutation(queries.ADD_COMPANY, {
    update(cache, { data: { addCompany } }) {
      const { recordCompanies } = cache.readQuery({
        query: queries.GET_COMPANIES,
      });
      cache.writeQuery({
        query: queries.GET_COMPANIES,
        data: { recordCompanies: [...recordCompanies, addCompany] },
      });
    },
  });

  const onSubmitArtist = (e) => {
    e.preventDefault();
    let name = document.getElementById("name");
    let dateFormed = document.getElementById("dateFormed");
    let members = document.getElementById("members");
    addArtist({
      variables: {
        name: name.value,
        dateFormed: dateFormed.value,
        members: members.value.split(","),
      },
    });

    document.getElementById("add-artist").reset();
    alert("Artist Added");
    props.closeAddFormState();
  };
  const onSubmitAlbum = (e) => {
    e.preventDefault();
    let title = document.getElementById("title");
    let releaseDate = document.getElementById("releaseDate");
    let genre = document.getElementById("genre");
    let songs = document.getElementById("songs");
    let artistId = document.getElementById("artistId");
    let companyId = document.getElementById("companyId");
    addAlbum({
      variables: {
        title: title.value,
        releaseDate: releaseDate.value,
        genre: genre.value,
        songs: songs.value.split(","),
        artistId: artistId.value,
        companyId: companyId.value,
      },
    });

    document.getElementById("add-album").reset();
    alert("Album Added");
    props.closeAddFormState();
  };
  const onSubmitCompany = (e) => {
    e.preventDefault();
    let name = document.getElementById("name");
    let country = document.getElementById("country");
    let foundedYear = document.getElementById("foundedYear");
    addCompany({
      variables: {
        name: name.value,
        country: country.value,
        foundedYear: parseInt(foundedYear.value),
      },
    });

    document.getElementById("add-company").reset();
    alert("Company Added");
    props.closeAddFormState();
  };
  let artists, recordCompanies
  let body = null;
  const {data: artistData} = useQuery(queries.GET_ARTISTS);
  if (artistData) {
    artists = artistData.artists
  }
  const {data: companyData} = useQuery(queries.GET_COMPANIES);
  if (companyData) {
    recordCompanies = companyData.recordCompanies
  }
  if (props.type === "artist") {
    body = (
      <div className="card">
        <form className="form" id="add-artist" onSubmit={onSubmitArtist}>
          <div className="form-group">
            <label>
              Name:
              <br />
              <input id="name" required autoFocus={true} />
            </label>
          </div>
          <br />
          <div className="form-group">
            <label>
              Date Formed:
              <br />
              <input id="dateFormed" required />
            </label>
          </div>
          <br />
          <div className="form-group">
            <label>
              Members (separate with with a comma and no spaces):
              <br />
              <input id="members" required />
            </label>
          </div>

          <br />
          <br />
          <button className="button add-button" type="submit">
            Add Artist
          </button>
          <button
            type="button"
            className="button cancel-button"
            onClick={() => {
              document.getElementById("add-artist").reset();
              props.closeAddFormState();
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }
  if (props.type === "album") {
    body = (
      <div className="card">
        <form className="form" id="add-album" onSubmit={onSubmitAlbum}>
          <div className="form-group">
            <label>
              Title:
              <br />
              <input id="title" required autoFocus={true} />
            </label>
          </div>
          <br />
          <div className="form-group">
            <label>
              Release Date:
              <br />
              <input id="releaseDate" required />
            </label>
          </div>
          <br />
          <div className="form-group">
            <label>
              Genre:
              <br />
              <input id="genre" required />
            </label>
          </div>
          <br />
          <div className="form-group">
            <label>
              Songs (separate with a comma and no spaces):
              <br />
              <input id="songs" required />
            </label>
          </div>
          <br />
          <div className="form-group">
            <label>
              Company:
              <br />
              <select
                className="form-control"
                id="companyId"
                ref={(node) => {
                  companyId = node;
                }}
              >
                {recordCompanies &&
                  recordCompanies.map((company) => {
                    return (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    );
                  })}
              </select>
            </label>
          </div>
          <br />
          <div className="form-group">
            <label>
              Artist:
              <br />
              <select
                className="form-control"
                id="artistId"
                ref={(node) => {
                  artistId = node;
                }}
              >
                {artists &&
                  artists.map((artist) => {
                    return (
                      <option key={artist._id} value={artist._id}>
                        {artist.name}
                      </option>
                    );
                  })}
              </select>
            </label>
          </div>
          <br />
          <br />
          <button className="button add-button" type="submit">
            Add Album
          </button>
          <button
            type="button"
            className="button cancel-button"
            onClick={() => {
              document.getElementById("add-album").reset();
              props.closeAddFormState();
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }
  if (props.type === "company") {
    body = (
      <div className="card">
        <form className="form" id="add-company" onSubmit={onSubmitCompany}>
          <div className="form-group">
            <label>
              Name:
              <br />
              <input id="name" required autoFocus={true} />
            </label>
          </div>
          <br />
          <div className="form-group">
            <label>
              Country:
              <br />
              <input id="country" required />
            </label>
          </div>
          <br />
          <div className="form-group">
            <label>
              Founded Year:
              <br />
              <input id="foundedYear" required />
            </label>
          </div>
          <br />
          <br />
          <button className="button add-button" type="submit">
            Add Company
          </button>
          <button
            type="button"
            className="button cancel-button"
            onClick={() => {
              document.getElementById("add-company").reset();
              props.closeAddFormState();
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }
  return <div>{body}</div>;
}

export default Add;
