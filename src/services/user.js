const User = require('../models/user')

const getUserByPnum = async (pNum) => {
    if(pNum){
        const user = await User.findOne({personal_number:pNum}).lean()
        return user
    } else {
        return Promise.reject('Personal number needst to be provided')
    }
}

module.exports = {
    getUserByPnum
}
