const filterServType = require('./serviceTypeFilter')
const MqttHandler = require('../MqttHandler')
const client = new MqttHandler().getClient()


const transform  = function (topic, payload, discard) {
    let rTopic = null
    
    try{
        rTopic = topic.split('/')[1]
    } catch(e){
    }

    try{   
        const jPayload = JSON.parse(payload)
        
        if(rTopic){
            if(discard){
                if(rTopic){
                    client.publish(`${rTopic}/appointments`,`{"success":false, "reason":"Server is overloaded with requests"}`,{qos:2})
                }
                
            } else {
                jPayload.resTopic = rTopic
                filterServType(jPayload)
            }
        } 

    } catch(e) {
        if(rTopic){
            client.publish(`${rTopic}`,`{"success":false, "reason":"${e.message}"}`,{qos:2})
        }
    }
}


module.exports = transform
