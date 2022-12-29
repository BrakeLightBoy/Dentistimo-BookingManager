const appointmentService = require('../services/appointment')
const appointmentHandler = require('../appointmentHandler')
const MqttHandler = require('../MqttHandler')
const client = new MqttHandler().getClient()

const transform = (payload) => {
    
        if(payload.operation){
            switch(payload.operation){
                case 'user-appointments':
                    appointmentService.getAppointmentsByUser(payload.personal_number).then(res => {
                        console.log('res.topic:', payload.resTopic)
                        const resPayload = {data: res, operation: 'user-appointments'}
                        client.publish(`${payload.resTopic}/appointments`,JSON.stringify(resPayload),{qos:2})
                    }).catch( e => {
                        console.log(e)
                    })
                    break;
                case 'unbooked-appointments':
                    appointmentHandler.postAppointments(payload.clinicId, payload.year, payload.month)
                    break;
                case 'book-appointment':
                    appointmentHandler.registerBooking(payload.userId, payload.clinicId, payload.date).then(res => {
                        console.log('res.topic:', res)
                        console.log('res.topic.DOCTOR:', payload.resTopic)
                        client.publish(`${payload.resTopic}/appointments`,'{"success":true, "operation":"book-appointment"}',{qos:2})
                    }).catch( e => {
                        console.log(e)
                    })
                    break;
                case 'dentist-appointments':
                    appointmentService.getAppointmentsByDentist(payload.username).then(res => {
                        console.log('res.topic:', payload.resTopic)
                        client.publish(`${payload.resTopic}/appointments`,JSON.stringify(res),{qos:2})
                    }).catch( e => {
                        console.log(e)
                    })
                    break;
                case 'delete-dentist-appointment':
                    appointmentService.deleteAppointment(payload.appointment_id).then(res => {
                        console.log('res.topic:', payload.resTopic)
                        client.publish(`${payload.resTopic}/appointments`,'{"success":true, "operation":"delete-dentist-appointment"}',{qos:2})
                    }).catch( e => {
                        console.log(e)
                    })
                    break;
                case 'delete-user-appointment':
                    appointmentService.deleteAppointment(payload.appointment_id).then(res => {
                        console.log('res.topic:', payload.resTopic)
                        client.publish(`${payload.resTopic}/appointments`,'{"success":true, "operation":"delete-user-appointment"}',{qos:2})
                    }).catch( e => {
                        console.log(e)
                    })
                    break;
                default:
                    console.log('Wrong user operation given')
            }
        } else {
            console.log('No operation given')
        }
}

module.exports = transform