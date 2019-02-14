let websocket = null;
let pluginUUID = null;
let lightTicker = [];

const actions = {
    // Light Toggle
    lighttoggle: {
        type : "de.tobimori.streamdeck.homeassistant.light.toggle",

        onKeyUp : function(context, settings, coordinates, userDesiredState) {
            let ip = "";
            let authtoken = "";
            let domain = "";
            let service = "";
            let data = "";
    
            if(settings['ip'] != null){
                ip = settings["ip"];
            }
            if(settings['authtoken'] != null){
                authtoken = settings["authtoken"];
            }
            if(settings['domain'] != null){
                domain = settings["domain"];
            }
            if(settings['service'] != null){
                service = settings["service"];
            }
            if(settings['data'] != null){
                data = settings["data"];
            }
            if(!ip || !authtoken || !domain || !service) {
                this.ShowReaction(context, "Alert")
            } else {
                const request = new XMLHttpRequest();
                const url = `${ip}/api/services/${domain}/${service}`;
                request.open("POST", url);
                request.setRequestHeader("Authorization", `Bearer ${authtoken}`);
                if(data !== "") {
                    request.setRequestHeader("Content-Type", "application/json");
                    request.send(data);
                } else {
                    request.send();
                }
            }
        },

        onWillAppear : function(context, settings, multiaction) {
            multiaction ? lightTicker.push(context) : null;
        },

        onWillDisappear : function(context, settings, multiaction) {
            multiaction ? lightTicker.splice(lightTicker.indexOf(context), 1) : null;
        },

        setState : function(context, state) {
            var json = {
                "event": "setState",
                "context": context,
                "payload": {
                    "state": state
                }
            };
            websocket.send(JSON.stringify(json));
        }
    }
}

function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo)
{

    function registerPlugin(inPluginUUID)
    {
        const json = {
            "event": inRegisterEvent,
            "uuid": inPluginUUID
        };
        websocket.send(JSON.stringify(json));
    };

    pluginUUID = inPluginUUID;

    // Open Websocket
    websocket = new WebSocket("ws://localhost:" + inPort);

    websocket.onopen = function()
    {
        // WebSocket is connected, send message
        registerPlugin(pluginUUID);
    };

    // Received message from Stream Deck
    websocket.onmessage = function (evt)
    {
        const jsonObj = JSON.parse(evt.data);        
        console.log(jsonObj);

        if(jsonObj['action']) {
            const action = jsonObj.action.replace('de.tobimori.streamdeck.homeassistant.', '').split('.').join('');
            switch(jsonObj.event) {
                case "keyUp":
                    actions[action].onKeyUp(jsonObj.context, jsonObj.payload.settings, jsonObj.payload.coordinates, jsonObj.payload.userDesiredState)
                    break;
                case "willAppear":
                    actions[action].onWillAppear(jsonObj.context, jsonObj.payload.settings, jsonObj.payload.isInMultiAction);
                    break;
                case "willDisappear":
                    actions[action].onWillDisappear(jsonObj.context, jsonObj.payload.settings, jsonObj.payload.isInMultiAction);
                    break;
                default:
                    console.log("Received unknown event.");    
                    break;    
            };
        };
    };
};

function sleep(time) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > time){
            break;
        }
    }
}