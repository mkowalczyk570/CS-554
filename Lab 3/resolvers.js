import { GraphQLError, GraphQLScalarType } from "graphql";
import {createClient} from 'redis'
import {
    artists as artistCollection,
    albums as albumCollection,
    recordcompanies as recordcompaniesCollection
} from './config/mongoCollections.js'

import { ObjectId} from "mongodb";
import validation from './helpers.js'


const client = await createClient()
    .on("error", (err) => console.log("redis client error", err))
    .connect();

export const resolvers = {
    Query: {
        artists: async () => {
            const response = await client.exists("allArtists")
            if(response){
                const allArtists = await client.get("allArtists");
                const jsonRes = JSON.parse(allArtists)
                return jsonRes
            }
            const artists = await artistCollection();
            const allArtists = await artists.find({}).toArray();
            if(!allArtists){
                throw new GraphQLError(`Internal Server Error`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                })
            }
            await client.set("allArtists", JSON.stringify(allArtists))
            await client.expire("allArtists", 3600)
            return allArtists
        },
        albums: async () => {
            const response = await client.exists("allAlbums")
            if(response){
                const allAlbums = await client.get("allAlbums")
                const jsonRes = JSON.parse(allAlbums)
                return jsonRes
            }
            const albums = await albumCollection();
            const allAlbums = await albums.find({}).toArray();
            if(!allAlbums){
                throw new GraphQLError(`Internal Server Error`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                })
            }
            await client.set("allAlbums", JSON.stringify(allAlbums))
            await client.expire("allAlbums", 3600)
            return allAlbums
        },
        recordCompanies: async () => {
            const response = await client.exists("allCompanies")
            if(response){
                const allCompanies = await client.get("allCompanies")
                const jsonRes = JSON.parse(allCompanies)
                return jsonRes
            }
            const recordCompanies = await recordcompaniesCollection();
            const allRecordCompanies = await recordCompanies.find({}).toArray();
            if(!allRecordCompanies){
                throw new GraphQLError(`Internal Server Error`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                })
            }
            await client.set("allCompanies", JSON.stringify(allRecordCompanies))
            await client.expire("allCompanies", 3600)
            return allRecordCompanies
        },
        getArtistById: async (_, args) => {
            const artists = await artistCollection();
            const response = await client.exists("Artist: " + args._id.toString());
            if (response == 1){
                const artist = await client.get("Artist: " + args._id.toString())
                return JSON.parse(artist)
            }
            const searchId = new ObjectId(args._id);
            const artist = await artists.findOne({_id: searchId});
            if (!artist) {
            throw new GraphQLError('Artist Not Found', {
                extensions: {code: 'NOT_FOUND'}
            });
            }
            await client.set("Artist: " + args._id.toString(), JSON.stringify(artist))
            return artist;
        },
        getAlbumById: async (_, args) => {
            const albums = await albumCollection();
            const response = await client.exists("Album: " + args._id.toString());
            if (response){
                const album = await client.get("Album: " + args._id.toString())
                return JSON.parse(album)
            }
            const searchId = new ObjectId(args._id)
            const album = await albums.findOne({_id: searchId});
            if (!album) {
            throw new GraphQLError('Album Not Found', {
                extensions: {code: 'NOT_FOUND'}
            });
            }
            await client.set("Album: " + args._id.toString(), JSON.stringify(album))

            return album;
        },
        getCompanyById: async (_, args) => {
            const companies = await recordcompaniesCollection();
            const response = await client.exists("Company: " + args._id.toString());
            if (response){
                const company = await client.get("Company: " + args._id.toString())
                return JSON.parse(company)
            }
            const searchId = new ObjectId(args._id)
            const company = await companies.findOne({_id: searchId});
            if (!company) {
                throw new GraphQLError('Company Not Found', {
                    extensions: {code: 'NOT_FOUND'}
                });
            }
            await client.set("Company: " + args._id.toString(), JSON.stringify(company))

            return company;
        },
        getSongsByArtistId: async (_, args) => {
            const albums = await albumCollection();
            const response = await client.exists("songs:" + args.artistId.toString())
            if(response){
                const songs = await client.get("songs:" + args.artistId.toString())
                return JSON.parse(songs)
            }
            const searchId = new ObjectId(args.artistId)
            const albumArray = await albums.find({artistId: searchId}).toArray()
            if(!albumArray || albumArray.length === 0){
                throw new GraphQLError('No songs by artist found', {
                    extensions: {code: 'NOT_FOUND'}
                });
            }
            let songs = []
            albumArray.forEach((album) =>{
                album.songs.forEach((song) =>{
                    songs.push(song)
                })
                
            })
            const set = "songs:" + args.artistId.toString()
            await client.set(set, JSON.stringify(songs))
            await client.expire(set, 3600)
            return songs
        },
        albumsByGenre: async (_, args) => {
            const albums = await albumCollection();
            const response = await client.exists(args.genre.toLowerCase())
            if(response){
                const albums = await client.get(args.genre.toLowerCase())
                return JSON.parse(albums)
            }
            const albumArray = await albums.find({genre: args.genre}).toArray()
            if(!albumArray || albumArray.length === 0){
                throw new GraphQLError('No albums of specified genre found', {
                    extension: {code: 'NOT_FOUND'}
                })
            }
            await client.set(args.genre.toLowerCase(), JSON.stringify(albumArray))
            await client.expire(args.genre, 3600)
            return albumArray
        },
        companyByFoundedYear: async (_, args) => {
            if(args.max <= args.min){
                throw new GraphQLError('Max year must be greater than min year')
            }
            if(args.min < 1900 || args.max > 2024){
                throw new GraphQLError('Min year must be equal to or above 1900 and max year must be below 2025',
                {
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }
            const response = await client.exists(`min: ${args.min} max: ${args.max}`)
            if(response){
                const companies = await client.get(`min: ${args.min} max: ${args.max}`)
                return JSON.parse(companies)
            }
            const recordCompanies = await recordcompaniesCollection()
            const companyArray = await recordCompanies.find({foundedYear: 
                {$gte: args.min, $lte: args.max}
            }).toArray()
            if(!companyArray || companyArray.length === 0){
                throw new GraphQLError('No companies between specified bounds found',{
                    extension: {code: 'NOT_FOUND'}
                })
            }
            await client.set(`min: ${args.min} max: ${args.max}`, JSON.stringify(companyArray))
            await client.expire(`min: ${args.min} max: ${args.max}`, 3600)
            return companyArray
        },
        searchArtistByArtistName: async (_, args) => {
            const searchTerm = args.searchTerm.trim().toLowerCase();
            if(searchTerm.length === 0){
                throw new GraphQLError('Input string cannot be null or empty space',
                {
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }
            const response = await client.exists(searchTerm)
            if(response){
                const results = await client.get(searchTerm)
                return JSON.parse(results)
            }
            const artists = await artistCollection();
            const allArtists = await artists.find({}).toArray()
            const results = []
            allArtists.forEach((artist) =>{
                const name = artist.name.toLowerCase()
                if(name.includes(searchTerm)){
                    results.push(artist)
                }
            })

            if(!results || results.length === 0){
                throw new GraphQLError('No artists found with search term', {
                    extensions: {code: 'NOT_FOUND'}
                })
            }
            await client.set(searchTerm, JSON.stringify(results))
            await client.expire(searchTerm, 3600)
            return results

        }

    },
    Album:{
        artist: async (parentValue) => {
            const artists = await artistCollection();
            let artist = await artists.findOne({_id: new ObjectId(parentValue.artistId)});
            return artist
        },
        recordCompany: async (parentvalue) => {
            const recordCompanies = await recordcompaniesCollection();
            let recordCompany = await recordCompanies.findOne({_id: new ObjectId(parentvalue.recordCompanyId)})
            return recordCompany
        }
    },
    Artist:{
        numOfAlbums: async (parentValue) => {
            const albums = await albumCollection()
            const numOfAlbums = await albums.count({
                artistId: new ObjectId(parentValue._id)
            })
            return numOfAlbums
        },
        albums: async (parentValue) => {
            const albums = await albumCollection();
            const allAlbumsByArtist = await albums.find({artistId: new ObjectId(parentValue._id)}).toArray();
            if(!allAlbumsByArtist){
                throw new GraphQLError(`Internal Server Error`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                })
            }
            return allAlbumsByArtist
        }
    },
    RecordCompany:{
        numOfAlbums: async (parentValue) => {
            const albums = await albumCollection()
            const numOfAlbums = await albums.count({
                recordCompanyId: new ObjectId(parentValue._id)
            })
            return numOfAlbums
        },
        albums: async (parentValue) =>{
            const albums = await albumCollection();
            const albumsPublished = await albums.find({recordCompanyId: new ObjectId(parentValue._id)}).toArray();
            if(!albumsPublished){
                throw new GraphQLError(`Internal Server Error`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                })
            }
            return albumsPublished 
        }
    },
    Mutation: {
        addArtist: async (_, args) => {
            const name = validation.nameCheck(args.name)
            const date_formed = validation.dateCheck(args.date_formed)
            const members = validation.arrayStringCheck(args.members)

            const artists = await artistCollection();
            
            const newArtist = {
                _id: new ObjectId(),
                name: name,
                dateFormed: date_formed,
                members: members,
                albums: []
            }
            let insertedArtist = await artists.insertOne(newArtist)
            if(!insertedArtist.acknowledged || !insertedArtist.insertedId){
                throw new GraphQLError('Could not add artist',{
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                })
            }
            if(client.exists("allArtists")){
                client.del("allArtists")
            }
            const artistId = newArtist._id.toString()
            await client.set(artistId, JSON.stringify(newArtist))
            return newArtist
        },
        editArtist: async(_, args) => {
            if(!ObjectId.isValid(args._id)){
                throw new GraphQLError('Invalid _id',{
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }
            const artists = await artistCollection();
            const searchTerm = new ObjectId(args._id)
            const artist = await artists.findOne({_id: searchTerm})
            if(!artist){
                throw new GraphQLError('No artist with specified Id found', {
                    extensions: {code: 'NOT_FOUND'}
                })
            }
            if(!args.name && !args.date_formed && !args.members){
                throw new GraphQLError('You must supply at least one argument to edit', {
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }
            const newArtist ={
                _id: new ObjectId(args._id),
                name: artist.name,
                dateFormed: artist.dateFormed,
                members: artist.members,
                albums: []
            }
            if(args.name){
                newArtist.name = validation.nameCheck(args.name)
            }
            if(args.date_formed){
                newArtist.dateFormed = validation.dateCheck(args.date_formed)
                const albums = await albumCollection();
                const albumArray = await albums.find({}).toArray();
                for(const album of albumArray){
                    const albumDoc = await albums.findOne({_id: album._id})
                    const dFormed = new Date(args.date_formed);
                    const dReleased = new Date(albumDoc.releaseDate)
                    const currentDate = new Date()
                    if(dFormed > dReleased){
                        throw new GraphQLError("Date formed is greater than the album release dates",{
                            extensions:{code: 'BAD_USER_INPUT'}
                        })
                    }
                    else if(dFormed > currentDate){
                        throw new GraphQLError("Date formed is greater than current date",{
                            extensions:{code: 'BAD_USER_INPUT'}
                        })
                    }
                }
            }
            if(args.members){
                newArtist.members = validation.arrayStringCheck(args.members)
            }
            await artists.updateOne({_id: searchTerm}, {$set: newArtist})
            if(client.exists("allArtists")){
                client.del("allArtists")
            }
            const artistId = newArtist._id.toString();
            await client.set(artistId, JSON.stringify(newArtist))
            return newArtist
        },
        removeArtist: async (_, args) => {
            const artists = await artistCollection();
            if(!ObjectId.isValid(args._id)){
                throw new GraphQLError('Invalid _id',{
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }
            const albums = await albumCollection();
            const allAlbums = await albums.find({}).toArray()
            const recordCompanies = await recordcompaniesCollection();
            const allCompanies = await recordCompanies.find({}).toArray()
            const searchTerm = new ObjectId(args._id)

            let albumsByArtist = []
            allAlbums.forEach((album) => {
                const artistId = album.artistId.toString()
                if(artistId === args._id){
                    albumsByArtist.push(album._id)
                }
            })
            albums.deleteMany({"artistId": searchTerm})
            let albumsByArtistStrings = []
            albumsByArtist.forEach((album) => {
                albumsByArtistStrings.push(album.toString())
            })

            allCompanies.forEach((recordCompany) => {
                const albumsReleased = recordCompany.albums;
                let albumsreleasedString = []
                albumsReleased.forEach((album) => {
                    albumsreleasedString.push(album.toString())
                })

                const filteredAlbums = albumsreleasedString.filter(item => !albumsByArtistStrings.includes((item)));
                const companyId = new ObjectId(recordCompany._id)
                let newAlbums = []
                filteredAlbums.forEach((album) =>{
                    newAlbums.push(new ObjectId(album))
                })
                recordCompanies.updateOne({_id: companyId}, {$set: {albums: newAlbums}})
            })

            const deletedArtist = await artists.findOneAndDelete({_id: searchTerm})
            if(!deletedArtist){
                throw new GraphQLError('No artist with specified Id found',{
                    extensions: {code: 'NOT_FOUND'}
                })
            }
            if(client.exists("allArtists")){
                client.del("allArtists")
            }
            await client.del(args._id)
            return deletedArtist
        },
        addCompany: async (_, args) => {
            const name = validation.nameCheck(args.name)
            const founded_year = validation.yearCheck(args.founded_year)
            const country = args.country.trim()

            if(typeof country !== 'string' || country.length === 0){
                throw new GraphQLError('Country must be a valid string that is not just spaces', {
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }
    
            const companies = await recordcompaniesCollection();
            
            const newCompany = {
                _id: new ObjectId(),
                name: name,
                foundedYear: founded_year,
                country: country,
                albums: []
            }
            let insertedCompany = await companies.insertOne(newCompany)
            if(!insertedCompany.acknowledged || !insertedCompany.insertedId){
                throw new GraphQLError('Could not add company',{
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                })
            }
            if(client.exists("allCompanies")){
                await client.del("allCompanies")
            }
            const companyId = newCompany._id.toString()
            await client.set(companyId, JSON.stringify(newCompany))
            return newCompany
        },
        editCompany: async(_, args) => {
            if(!ObjectId.isValid(args._id)){
                throw new GraphQLError('Invalid _id',{
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }
            const companies = await recordcompaniesCollection();
            const searchTerm = new ObjectId(args._id)
            const company = await companies.findOne({_id: searchTerm})
            if(!company){
                throw new GraphQLError('No company with specified Id found', {
                    extensions: {code: 'NOT_FOUND'}
                })
            }
            if(!args.name && !args.founded_year && !args.country){
                throw new GraphQLError('You must supply at least one argument to edit', {
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }
            const newCompany ={
                _id: new ObjectId(args._id),
                name: company.name,
                foundedYear: company.foundedYear,
                country: company.country,
                albums: company.albums
            }
            if(args.name){
                newCompany.name = validation.nameCheck(args.name)
            }
            if(args.founded_year){
                newCompany.foundedYear = validation.yearCheck(args.founded_year)
                const albums = await albumCollection();
                const albumArray = await albums.find({}).toArray();
                for(const album of albumArray){
                    const albumDoc = await albums.findOne({_id: album._id})
                    const dFormed = new Date("01/01/" + args.founded_year);
                    const dReleased = new Date(albumDoc.releaseDate)
                    const currentDate = new Date()
                    if(dFormed > dReleased){
                        throw new GraphQLError("Founded year is greater than the album release date(s)",{
                            extensions:{code: 'BAD_USER_INPUT'}
                        })
                    }
                    else if(dFormed > currentDate){
                        throw new GraphQLError("Founded year is greater than current date",{
                            extensions:{code: 'BAD_USER_INPUT'}
                        })
                    }
                }
            }
            if(args.country){
                if(args.country.length !== 0){
                    newCompany.country = args.country
                } else{
                    throw new GraphQLError('Country must be a valid string that is not just spaces', {
                        extensions: {code: 'BAD_USER_INPUT'}
                    })
                }
            }
            

            await companies.updateOne({_id: searchTerm}, {$set: newCompany})
            if(client.exists("allCompanies")){
                await client.del("allCompanies")
            }
            const companyId = newCompany._id.toString()
            await client.set(companyId, JSON.stringify(newCompany))
            return newCompany
        },
        removeCompany: async (_, args) => {
            const companies = await recordcompaniesCollection();
            if(!ObjectId.isValid(args._id)){
                throw new GraphQLError('Invalid _id',{
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }
            const searchTerm = new ObjectId(args._id)
            const deletedCompany = await companies.findOneAndDelete({_id: searchTerm})
            if(!deletedCompany){
                throw new GraphQLError('No company with specified Id found',{
                    extensions: {code: 'NOT_FOUND'}
                })
            }
            const albums = await albumCollection()
            const artists = await artistCollection();
            let artistArray = await artists.find({}).toArray();
            for(let artist of artistArray){
                let artistAlbums = artist.albums
                for(let album of artistAlbums){
                    let albumDoc = await albums.findOne({_id: album})
                    let recordCompany = albumDoc.recordCompanyId.toString()
                    if(recordCompany === searchTerm.toString()){
                        await artists.updateOne({_id: new ObjectId(artist._id)}, {$pull: {albums: new ObjectId(albumDoc._id)}})
                    }
                }
            }
            albums.deleteMany({recordCompanyId: searchTerm})
            if(client.exists("allCompanies")){
                await client.del("allCompanies")
            }
            return deletedCompany
        },
        addAlbum: async (_, args) => {
            const title = validation.stringCheck(args.title)
            const releaseDate = validation.dateCheck(args.releaseDate)
            const genre = validation.stringCheck(args.genre)
            const songs = validation.arrayStringCheck(args.songs)
            
            if(!ObjectId.isValid(args.artistId) || !ObjectId.isValid(args.companyId)){
                throw new GraphQLError('Invalid id',{
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }
            const artistId = new ObjectId(args.artistId);
            const companyId = new ObjectId(args.companyId)
            const albums = await albumCollection();
            const artists = await artistCollection();
            const companies = await recordcompaniesCollection();
            
            const artist = await artists.findOne({_id: artistId})
            if(!artist){
                throw new GraphQLError('Artist with provided Id does not exist', {
                    extensions: {code: "NOT_FOUND"}
                })
            }
            const company = await companies.findOne({_id: companyId})
            if(!company){
                throw new GraphQLError('Company with provided Id does not exist', {
                    extensions: {code: "NOT_FOUND"}
                })
            }
            const foundedYear = "01/01/" + company.foundedYear.toString()
            const companyFoundedDate = new Date(foundedYear);
            const albumReleasedDate = new Date(args.releaseDate);
            const artistFoundedDate = new Date(artist.dateFormed);
            const currentDate = new Date()

            if(albumReleasedDate < artistFoundedDate || albumReleasedDate > currentDate || albumReleasedDate < companyFoundedDate){
                throw new GraphQLError('Album release date cannot be before artist/company founded date. It also cannot be in the future')
            }

            const newAlbumId = new ObjectId()
            const newAlbum = {
                _id: newAlbumId,
                title: title,
                releaseDate: releaseDate,
                genre: genre,
                artistId: new ObjectId(args.artistId),
                recordCompanyId: new ObjectId(args.companyId),
                songs: songs
            }
            let insertedAlbum = await albums.insertOne(newAlbum)
            if(!insertedAlbum.acknowledged || !insertedAlbum.insertedId){
                throw new GraphQLError('Could not add album',{
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                })
            }
            
            await artists.updateOne(
                {_id: artistId},
                {$push: {albums: newAlbumId}}
            )

            await companies.updateOne(
                {_id: companyId},
                {$push: {albums: newAlbumId}}
            )
            if (client.exists("allAlbums")){
                await client.del("allAlbums")
            }
            const albumId = newAlbum._id.toString()
            await client.set(albumId, JSON.stringify(newAlbum))
            
            return newAlbum
        },
        editAlbum: async(_, args) => {
            if(!ObjectId.isValid(args._id)){
                throw new GraphQLError('Invalid _id',{
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }
            const albums = await albumCollection();
            const searchTerm = new ObjectId(args._id)
            const album = await albums.findOne({_id: searchTerm})
            if(!album){
                throw new GraphQLError('No album with specified Id found', {
                    extensions: {code: 'NOT_FOUND'}
                })
            }
            if(!args.title && !args.releaseDate && !args.genre && !args.songs && !args.artistId && !args.companyId){
                throw new GraphQLError('You must supply at least one argument to edit', {
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }
            const artists = await artistCollection();
            const companies = await recordcompaniesCollection();

            const artist = await artists.findOne({_id: album.artistId})
            const company = await companies.findOne({_id: album.recordCompanyId})
    
            const albumReleasedDate = new Date(args.releaseDate);
            const companyFoundingDate = new Date("01/01/" + company.founded_year)
            const artistFormDate = new Date(artist.dateFormed)
            const currentDate = new Date()

            if(albumReleasedDate > currentDate){
                throw new GraphQLError('Album release date cannot be in the future', {
                    extensions:{code: 'BAD_USER_INPUT'}
                })
            } 
            else if(albumReleasedDate < companyFoundingDate || albumReleasedDate < artistFormDate){
                throw new GraphQLError('Album release date cannot be before company founding/artist formation date', {
                    extensions:{code: 'BAD_USER_INPUT'}
                })
            }
            
            const newAlbum = {
                _id : searchTerm,
                title : album.title,
                releaseDate: album.releaseDate,
                genre: album.genre,
                songs: album.songs,
                artistId: new ObjectId(args.artistId),
                recordCompanyId: new ObjectId(args.companyId)
            }
            if(args.title){
                newAlbum.title = validation.stringCheck(args.title)
            }
            if(args.releaseDate){
                newAlbum.releaseDate = validation.dateCheck(args.releaseDate)
            }
            if(args.genre){
                newAlbum.genre = validation.stringCheck(args.genre)
            }
            if(args.songs){
                newAlbum.songs = validation.arrayStringCheck(args.songs)
            }
            if(args.artistId){
                if(!ObjectId.isValid(args.artistId)){
                    throw new GraphQLError('Invalid id',{
                        extensions: {code: 'BAD_USER_INPUT'}
                    })
                }
                const artistSearch = new ObjectId(args.artistId)
                const artist = await artists.findOne({_id: artistSearch})
                if(!artist){
                throw new GraphQLError('Artist with provided Id does not exist', {
                    extensions: {code: "NOT_FOUND"}
                })
                }
                else{
                    if(client.exists(args.artistId)){
                        await client.del(args.artistId)
                    }
                    artists.updateOne(
                        {id: artistSearch},
                        {$pull: {albums: searchTerm}}
                    )
                    newAlbum.artistId = new ObjectId(args.artistId)}
            }
            if(args.companyId){
                if(!ObjectId.isValid(args.companyId)){
                    throw new GraphQLError('Invalid id',{
                        extensions: {code: 'BAD_USER_INPUT'}
                    })
                }
                const searchCompany = new ObjectId(args.companyId)
                const company = await companies.findOne({_id: searchCompany})
                if(!company){
                throw new GraphQLError('Company with provided Id does not exist', {
                    extensions: {code: "NOT_FOUND"}
                })
                }else{
                    if(client.exists(args.companyId)){
                        await client.del(args.companyId)
                    }
                    companies.updateOne(
                        {id: searchCompany},
                        {$pull: {albums: searchTerm}}
                    )
                    newAlbum.companyId = new ObjectId(args.companyId)
                }
            }
            

            await albums.updateOne({_id: searchTerm}, {$set: newAlbum})
            
            if(args.artistId){
                await artists.updateOne(
                    {_id: new ObjectId(args.artistId)},
                    {$push: {albums: newAlbumId}}
                )
            }
                if(args.companyId){
                await companies.updateOne(
                    {_id: new ObjectId(args.companyId)},
                    {$push: {albums: newAlbumId}}
                )
            }

            if (client.exists("allAlbums")){
                await client.del("allAlbums")
            }

            const albumId = newAlbum._id.toString()
            await client.set(albumId, JSON.stringify(newAlbum))
            return newAlbum
        },
        removeAlbum: async (_, args) => {
            const albums = await albumCollection();
            if(!ObjectId.isValid(args._id)){
                throw new GraphQLError('Invalid _id',{
                    extensions: {code: 'BAD_USER_INPUT'}
                })
            }
            const searchTerm = new ObjectId(args._id)
            
            const deletedAlbum = await albums.findOneAndDelete({_id: searchTerm})
            if(!deletedAlbum){
                throw new GraphQLError('No album with specified Id found',{
                    extensions: {code: 'NOT_FOUND'}
                })
            }
            const companies = await recordcompaniesCollection();
            const artists = await artistCollection()
            await companies.updateOne(
                {_id: new ObjectId(deletedAlbum.recordCompanyId)},
                {$pull: {albums: searchTerm}}
            )
            await artists.updateOne(
                {_id: new ObjectId(deletedAlbum.artistId)},
                {$pull: {albums: searchTerm}}
            )

            await client.del(args._id)
            if(client.exists("allAlbums")){
                await client.del("allAlbums")
            }
            return deletedAlbum
        }
    }


}