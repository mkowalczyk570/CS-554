import {ObjectId} from 'mongodb';

const exportedMethods = {
    stringCheck(string){
        if(!string) throw 'Missing argument string'
        if(typeof string !== 'string') throw 'Argument must be a stringe'
        if(string.trim().length === 0) throw 'String cannot be empty spaces'
        return string.trim()
    },
    numCheck(num){
        if(num === undefined || num === null) throw 'You must provide query parameters'
        num = parseInt(num)
        if(typeof num !== 'number' || isNaN(num)) throw 'Query must be of type number'
        if(num < 0) throw 'Query must be a positive number' 
        return num

    },
    nameCheck(name){
        const nameRegex = /^[A-Za-z]+$/
        if(!nameRegex.test(name)) throw 'Name can only contain letters'
    },
    usernameCheck(username){
        const usernameRegex = /^[A-Za-z0-9]{3,20}$/
        if(!usernameRegex.test(username)) throw 'Username can only contain letters and numbers and be of length 3-20'
    },
    passwordCheck(password){
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^\&*\)\(+=._-])[a-zA-Z0-9!@#\$%\^\&*\)\(+=_-]{8,}$/;
        if(!passwordRegex.test(password)) throw "Password must be of at least length 8 and contain 1 uppercase letter, 1 number, and 1 special character from the following [ !@#$%^&*+=_- ] "
    },
    idCheck(id){
        if(!id) throw 'You must provide an id to search for'
        if(!ObjectId.isValid(id)) throw 'invalid object Id'
        return id;
    }
}

export default exportedMethods