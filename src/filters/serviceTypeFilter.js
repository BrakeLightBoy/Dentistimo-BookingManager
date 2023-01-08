const filterAppointmentServ = require('./appointmentServFilter')

const transform = (payload) => {
    if(payload.opCat){
        switch(payload.opCat){
            case 'appointment':
                filterAppointmentServ(payload)
                break;
        }
    } 
}

module.exports = transform
