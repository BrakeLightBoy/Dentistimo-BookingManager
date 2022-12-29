const filterAppointmentServ = require('./appointmentServFilter')

const transform = (payload) => {
    if(payload.opCat){
        switch(payload.opCat){
            case 'appointment':
                filterAppointmentServ(payload)
                break;
        }
    } else {
        console.log('No operation category given')
    }
}

module.exports = transform
