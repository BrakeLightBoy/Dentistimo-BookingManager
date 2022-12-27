const clinicService = require('./services/clinic')

class MqttHandler{
    constructor() {
        const mqtt = require('mqtt');

        const brokerHost = 'localhost';
        const brokerPort = 9001;
        const brokerURI = process.env.BROKER_URI || `ws://${brokerHost}:${brokerPort}`;


        if(MqttHandler.instance instanceof MqttHandler){
            return MqttHandler.instance;
        }
            
        const client = mqtt.connect(brokerURI);    

        
        client.on('connect', () => {
            console.log(`Connected to MQTT broker with URI: ${brokerURI}`);

            client.subscribe('common/#',{qos:2})


            clinicService.getAllClinics().then(res => {

                for (const clinic of res){
                    

                 // console.log(`DUMMY DATA: topic: clinics/${clinic.id}/slots/2022/12 payload: ${dec_str}`)
                    // clinicService.getClinicAppointments(clinic.id).then(appointments => {
                    //     const months = {}
                    //     for (const appointment of appointments){
                    //         const month = 1 + appointment.date.getUTCMonth() 
                    //         const year = appointment.date.getUTCFullYear()
                    //         // console.log('Entry: '+clinic.id+"/"+month+'-'+year)
                    //     }     
                    //     // console.log("ap2:",appointments)
                    // }).catch(e => {
                    //     console.log(e)
                    // })
                }

                console.log('publish',JSON.stringify(res))
                client.publish('clinics',JSON.stringify(res),{qos:2, retain:true})
            }).catch(e => {
                console.log('Failed to get clinics')
                console.log(e)              
            })
        })

        client.on('error',error => {
            console.error(`Failed to connect to mqtt broker with URI: ${brokerURI}`);
            console.error(error.stack);
            process.exit(1);
        })

        this.client = client
        MqttHandler.instance = this;
    }

    getClient(){
        return this.client;
    }
}

module.exports = MqttHandler