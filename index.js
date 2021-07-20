const WebSocket = require("ws");
const yup = require("yup");

const wss = new WebSocket.Server({port: 8082});

/*
* Collection of "yup" schemas for each event type.
*
* @type {Object.<string, yup.Schema>}
*/

const yupEventSchemas = {
    "PLAYER_MOVEMENT": yup.object().shape({
        x: yup.number().required().integer(),
        y: yup.number().required().integer(),
        // description: yup.string().required().max(200),
    })
};

/* 
    Validates and parses an imcoming to ensure it is in the form 
    of JSON and the schema is OK.

    @param {string} message: A WebSocket message received from the client 
    @returns {{event: string, payload: object}}
    @throws Will throw an error if message is invalid
*/

function parseMessage(message){
    const object = JSON.parse(message);

    if(!("event" in object)){
        throw new Error("Event property not provided!");
    }

    if(!("payload" in object)){
        throw new Error("Payload property not provided!");
    }

    object.payload = yupEventSchemas[object.event].validateSync(object.payload);

    return object;
}

wss.on("connection", ws => {
    console.log("New client connected!");

    ws.on("message", message => {
        let data; 

        try{
            data = parseMessage(message);
        }catch (err) {
            console.log(`INVALID MESSAGE: ${err.message}`);
            return;
        }

        console.log(data);

        switch(data.event) {
            case "POST_COMMENT":
                console.log("OK... received player movement");
            break;
        }
    })
}) 