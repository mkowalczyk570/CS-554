import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import {albums, artists, recordcompanies} from '../config/mongoCollections.js'
import { ObjectId } from "mongodb";

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    const artistCollection = await artists();
    const albumCollection = await albums();
    const recordcompaniesCollection = await recordcompanies();

    const gojiraId = new ObjectId()
    const fortId = new ObjectId()
    const sauvId = new ObjectId()

    const aetherId = new ObjectId()
    const tarotId = new ObjectId()
    const vikingsId = new ObjectId()

    const rareId = new ObjectId()
    const attaboyId = new ObjectId()
    const whoopId = new ObjectId()

    const rrrId = new ObjectId()
    const nrId = new ObjectId()
    const roId = new ObjectId()
    await artistCollection.insertMany([
        {
            _id: gojiraId,
            name: 'Gojira',
            dateFormed: "01/01/1996",
            members: ["Joe Duplantier", "Mario Duplantier", "Chirstian Andreu", "Jean-Michel Labadie"],
            albums: [sauvId, fortId]
        },
        {
            _id: aetherId,
            name: 'Aether Realm',
            dateFormed: "01/01/2010",
            members: ["Vincent Jones", "Donny Burbage", "Heinrich Yoshio", "Tyler Gresham"],
            albums: [tarotId, vikingsId]
        },
        {
           _id: rareId,
           name: "The Rare Occasions",
           dateFormed: "01/01/2012",
           members: ["Brian McLaughlin", "Jeremy Cohen", "Luke Imbusch"],
           albums: [whoopId, attaboyId]
        }
    ]);

    await albumCollection.insertMany([
        {
            _id: sauvId,
            title: "L'Efant Sauvage",
            releaseDate: "06/26/2012",
            genre: "ROCK",
            artistId: gojiraId,
            recordCompanyId: rrrId,
            songs: ["Explosia", "L'Efant sauvage", "The Axe", "Liquid Fire", "The Wild Healer", "Planned Obsolescence", "Mouth of Kala", "The Gift of Guilt"]
        },
        {
            _id: fortId,
            title: "Fortitude",
            releaseDate: "04/30/2021",
            genre: "ROCK",
            artistId: gojiraId,
            recordCompanyId: rrrId,
            songs: ["Born For One Thing", "Amazonia", "Another World", "Hold On", "New Found", "Fortitude", "The Changt", "Sphinx"]
        },
        {
            _id: tarotId,
            title: "Tarot",
            releaseDate: "06/02/2017",
            genre: "ROCK",
            artistId: aetherId,
            recordCompanyId: nrId,
            songs: ["The Fool", "Tarot", "The Tower", "King of Cups", "Death", "The Chariot", "The Devil", "The Emperor", "Strength", "Temperence", "The Sun, The Moon, The Star", "The Magician"]
        },
        {
            _id: vikingsId,
            title: "Redneck Vikings from Hell",
            releaseDate: "05/01/2020",
            genre: "ROCK",
            artistId: aetherId,
            recordCompanyId: nrId,
            songs: ["Redneck Vikings From Hell", "Goodbye", "Lean Into The Wind", "Hunger", "Guardian", "One Hallow Word","She's Back", "Slave to the Riff", "Cycle", "THMC", "Craft and the Creator"]    
        },
        {
            _id: whoopId,
            title: "Big Whoop",
            releaseDate: "06/18/2021",
            genre: "INDIE",
            artistId: rareId,
            recordCompanyId: roId,
            songs: ["Alone", "Bolts", "Control", "Stay", "Origami", "Sparrow", "Call Me When You Get There", "The American Way", "Do Not Do Drugs", "Cynical", "Set It Right", "The Fold"]
        },
        {
            _id: attaboyId,
            title: "Attaboy",
            releaseDate: "11/04/2023",
            genre: "INDIE",
            artistId: rareId,
            recordCompanyId: roId,
            songs: ["Seasick", "Not Afraid", "Start This Over", "Caterpillar!", "Turnaround", "Because You Love Me"]
        }
    ])

    await recordcompaniesCollection.insertMany([
    {
        _id: rrrId,
        name: "Roadrunner Records",
        foundedYear: 1980,
        country: "Netherlands",
        albums: [sauvId, fortId]
    },
    {
        _id: nrId,
        name: "Napalm Records",
        foundedYear: 1992,
        country: "Austria",
        albums: [tarotId, vikingsId]
    },
    {
        _id: roId,
        name: "The Rare Occassions",
        foundedYear: 2012,
        country: "United States",
        albums: [whoopId, attaboyId]
    }
    ])

    console.log("Done seeding database");
    await closeConnection();
}

main().catch(console.log)