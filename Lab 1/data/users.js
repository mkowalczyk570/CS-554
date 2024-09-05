import validation  from '../helpers.js'
import bcrypt from 'bcrypt'
import { users } from "../config/mongoCollections.js";

const SALT_ROUNDS = 10;

const exportedMethods = {
    async getUser(username){
        username = validation.stringCheck(username).toLowerCase()
        validation.usernameCheck(username)

        const usersCollection = await users();
        const user = await usersCollection.findOne({username})
        if(!user) throw 'Error: No user with supplied username'
        return {_id: user._id.toString(), name: user.name, username: user.username, password: user.password}
    },
    async createUser(name, username, password){
        name = validation.stringCheck(name)
        validation.nameCheck(name)
        username = validation.stringCheck(username).toLowerCase()
        validation.usernameCheck(username)
        password = validation.stringCheck(password)
        validation.passwordCheck(password)

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
        const usersCollection = await users();

        const existingUser = await usersCollection.findOne({username})
        if(existingUser) throw "Username taken. Please supply a new one"

        const newUser = {
            name: name,
            username: username.toLowerCase(),
            password: hashedPassword
        }
        const insertedInfo = await usersCollection.insertOne(newUser);
        if(!insertedInfo.acknowledged || !insertedInfo.insertedId){throw 'Could not add user'};

        return {_id: insertedInfo.insertedId.toString(), name: name, username: username}
    }
}

export default exportedMethods