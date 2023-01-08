const filterServType = require('./serviceTypeFilter')
const MqttHandler = require('../MqttHandler')
const client = new MqttHandler().getClient()


const transform  = function (topic, payload, discard) {
    //temporary log messages
    console.log('topic:',topic)
    console.log('payload:',payload.toString())
    let rTopic = null
    
    try{
        rTopic = topic.split('/')[1]
    } catch(e){
        console.log(e)
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
        } else {
            console.log(`Parsing of topic failed, topic: ${topic} has invalid format`)
        }

    } catch(e) {
        if(rTopic){
            client.publish(`${rTopic}`,`{"success":false, "reason":"${e.message}"}`,{qos:2})
        }
    }
}


module.exports = transform
