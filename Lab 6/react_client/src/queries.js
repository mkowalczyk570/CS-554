import {gql} from '@apollo/client'

const GET_ALBUMS = gql`
    query {
        albums {
        _id
        title
        artist {
            name
            _id
        }
        genre
        releaseDate
        songs
        recordCompany {
            name
            _id
        }
        }
    }
`;

const GET_ONE_ALBUM = gql`
query GetAlbumById($id: String!) {
  getAlbumById(_id: $id) {
    _id
    artist {
      _id
      name
    }
    genre
    releaseDate
    songs
    title
    recordCompany {
      _id
      name
    }
  }
}`;

const GET_ONE_ARTIST = gql`
  query GetAlbumById($id: String!) {
    getArtistById(_id: $id) {
      _id
      name
      dateFormed
      members
      numOfAlbums
      albums {
        _id
        title
      }
    }
  }
`

const GET_ONE_COMPANY = gql`
query GetAlbumById($id: String!) {
  getCompanyById(_id: $id) {
    _id
    name
    country
    foundedYear
    numOfAlbums
    albums {
      _id
      title
    }
  }
}`

const ADD_ALBUM = gql`
    mutation createAlbum(
        $title: String!,
        $releaseDate: Date!,
        $genre: MusicGenre!,
        $songs: [String!]!,
        $artistId: String!,
        $companyId: String!
    ) {
        addAlbum(
            title: $title
            releaseDate: $releaseDate
            genre: $genre
            songs: $songs
            artistId: $artistId
            companyId: $companyId
        ) {
            _id
            title
            releaseDate
            genre
            songs
            artist {
            _id
            }
            recordCompany {
            _id
            }
        }
    }  
`
const EDIT_ARTIST = gql`
mutation EditArtist($id: String!, $name: String, $dateFormed: Date, $members: [String!]) {
  editArtist(_id: $id, name: $name, date_formed: $dateFormed, members: $members) {
    _id
    dateFormed
    members
    name
    numOfAlbums
    albums {
      _id
      title
    }
  }
}`
const EDIT_ALBUM = gql`
    mutation editAlbum(
        $id: String!, 
        $title: String, 
        $releaseDate: Date, 
        $genre: MusicGenre, 
        $songs: [String!], 
        $artistId: String, 
        $companyId: String) {
            editAlbum(
                _id: $id,
                title: $title,
                releaseDate: $releaseDate,
                genre: $genre,
                songs: $songs,
                artistId: $artistId, 
                companyId: $companyId
            ) {
            _id
            title
            releaseDate
            genre
            songs
            artist {
                _id
            }
            recordCompany {
                _id
            }
        }
    }
`

const EDIT_COMPANY = gql`
mutation Mutation(
  $id: String!, 
  $name: String, 
  $foundedYear: Int, 
  $country: String) {
  editCompany(_id: $id, name: $name, founded_year: $foundedYear, country: $country) {
    _id
    country
    name
    foundedYear
    numOfAlbums
    albums {
      _id
      title
    }
  }
}`

const DELETE_ALBUM = gql`
mutation deleteAlbum($id: String!) {
    removeAlbum(_id: $id) {
      _id
      title
      releaseDate
      genre
      songs
      artist {
        _id
        name
      }
      recordCompany {
        _id
        name
      }
    }
  }
`
const DELETE_ARTIST = gql`
mutation deleteArtist($id: String!) {
    removeArtist(_id: $id) {
      _id
      name
      dateFormed
      members
      numOfAlbums
      albums {
        _id
      }
    }
  }
`

const DELETE_COMPANY = gql`
mutation deleteCompany($id: String!) {
    removeCompany(_id: $id) {
      _id
      name
      foundedYear
      country
      albums {
        _id
      }
    }
  }
`


const GET_ARTISTS = gql`
    query{
        artists {
        _id
        name
        members
        dateFormed
        numOfAlbums
        albums {
            title
            _id
        }
        }
    }
`;

const ADD_ARTIST = gql`
mutation AddCompany($name: String!, $dateFormed: Date!, $members: [String!]!) {
  addArtist(name: $name, date_formed: $dateFormed, members: $members) {
    _id
    dateFormed
    members
    name
    numOfAlbums
    albums {
      _id
      title
    }
  }
}
`
const ADD_COMPANY = gql`
mutation AddCompany($name: String!, $foundedYear: Int!, $country: String!) {
  addCompany(name: $name, founded_year: $foundedYear, country: $country) {
    _id
    country
    name
    foundedYear
    numOfAlbums
    albums {
      _id
      title
    }
  }
}
`
const GET_COMPANIES = gql`
query{
    recordCompanies {
      _id
      name
      country
      foundedYear
      numOfAlbums
      albums {
        _id
      }
    }
  }
`;

const GET_ARTIST_BY_NAME = gql`
query Query($searchTerm: String!) {
  searchArtistByArtistName(searchTerm: $searchTerm) {
    _id
    dateFormed
    members
    name
    numOfAlbums
    albums {
      _id
      title
    }
  }
}`

const GET_COMPANY_BY_YEAR = gql`
query Query($min: Int!, $max: Int!) {
  companyByFoundedYear(min: $min, max: $max) {
    _id
    country
    foundedYear
    name
    numOfAlbums
    albums {
      _id
      title
    }
  }
}`

const GET_ALBUM_BY_GENRE = gql`
query AlbumsByGenre($genre: MusicGenre!) {
  albumsByGenre(genre: $genre) {
    _id
    title
    artist {
      _id
      name
    }
    songs
    releaseDate
    genre
    recordCompany {
      _id
      name
    }
  }
}`

let exportedQueries = {
    ADD_ALBUM,
    EDIT_ALBUM,
    GET_ALBUMS,
    DELETE_ALBUM,
    GET_COMPANIES,
    GET_ARTISTS,
    EDIT_ARTIST,
    DELETE_ARTIST,
    DELETE_COMPANY,
    GET_ONE_ALBUM,
    GET_ONE_ARTIST,
    GET_ONE_COMPANY,
    EDIT_COMPANY,
    ADD_ARTIST,
    ADD_COMPANY,
    GET_ARTIST_BY_NAME,
    GET_ALBUM_BY_GENRE,
    GET_COMPANY_BY_YEAR
}

export default exportedQueries