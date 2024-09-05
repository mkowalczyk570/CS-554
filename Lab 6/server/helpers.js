import validateDate from "validate-date" //https://www.npmjs.com/package/validate-date
import { GraphQLError, graphql } from "graphql"
const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/
const nameRegex = /^[a-zA-Z\s]+$/

const exportedMethods = {
    stringCheck(string){
        if(string.trim().length === 0 || typeof string !== 'string'){
            throw new GraphQLError('String input cannot be empty space and must be valid')
        }
        return string.trim();
    },
    yearCheck(founded_year){
        if(!Number.isInteger(founded_year) || (founded_year < 1900 || founded_year > 2024)){
            throw new GraphQLError('Founded year must be an integer between 1900 and 2024', {
                extensions: {code: 'BAD_USER_INPUT'}
            })
        }
        return founded_year
    },
    nameCheck(name){
        if(name.trim().length === 0) {
            throw new GraphQLError('Name must not be empty space', {
                extensions:{code: 'BAD_USER_INPUT'}
            })
        }
        if(!nameRegex.test(name)){
            throw new GraphQLError('Name must only contain characters A-Z')
        }
        return name.trim()
    },
    dateCheck(date){
        const dateSplit = date.split("/");
        if(dateSplit[0].length == 1){dateSplit[0] = "0" + dateSplit[0]}
        if(dateSplit[1].length == 1){dateSplit[1] = "0" + dateSplit[1]}
        date = dateSplit[0] + "/" + dateSplit[1] + "/" + dateSplit[2]
        if(!dateRegex.test(date)){
            throw new GraphQLError('Date must be of form MM/DD/YYYY', {
                extensions:{code: 'BAD_USER_INPUT'}
            })
        }
        const checkDate = validateDate(date, "boolean")
        if(!checkDate){
            throw new GraphQLError('Date must be a real date!', {
                extensions:{code: 'BAD_USER_INPUT'}
            })
        }
        if(dateSplit[2] < 1900 | dateSplit[2] > 2024){
            throw new GraphQLError('Year must be be between >= 1900 and <2024', {
                extensions:{code: 'BAD_USER_INPUT'}
            })
        }
        return date
    },
    arrayStringCheck(members){
        let returnMembers = [];
        if(members.length === 0 || !members){
            throw new GraphQLError('String list cannot be empty!', {
                extensions:{code: 'BAD_USER_INPUT'}
            })
        }
        members.forEach((member) =>{
            if(member.trim().length === 0 || !nameRegex.test(member)) {
                throw new GraphQLError('String names in array must not be empty space and can only contain letters a-z', {
                    extensions:{code: 'BAD_USER_INPUT'}
                })
            }
            returnMembers.push(member.trim())
        })
        return returnMembers
    }
}
export default exportedMethods