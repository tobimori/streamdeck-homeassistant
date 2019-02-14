let websocket = null;
let pluginUUID = null;
let settingsCache = {};

const webhookAction = {

    type : "de.tobimori.streamdeck.homeassistant.action",

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

    onWillAppear : function(context, settings, coordinates) {
        settingsCache[context] = settings;
    },

    ShowReaction : function(context, type) {
        const json = {
            "event": "show" + type,
            "context": context,
        };
        websocket.send(JSON.stringify(json));
    },

    SetSettings : function(context, settings) {
        const json = {
            "event": "setSettings",
            "context": context,
            "payload": settings
        };
        websocket.send(JSON.stringify(json));
    },

    SendSettings : function(action, context) {
        const json = {
            "action": action,
            "event": "sendToPropertyInspector",
            "context": context,
            "payload": settingsCache[context]
        };

        websocket.send(JSON.stringify(json));
    }
};

function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo)
{

    pluginUUID = inPluginUUID;
    websocket = new WebSocket("ws://localhost:" + inPort);

    function registerPlugin(inPluginUUID)
    {
        const json = {
            "event": inRegisterEvent,
            "uuid": inPluginUUID
        };
        websocket.send(JSON.stringify(json));
    };

    websocket.onopen = function()
    {
        // WebSocket is connected, send message
        registerPlugin(pluginUUID);
    };

    websocket.onmessage = function (evt)
    {
        // Received message from Stream Deck
        const jsonObj = JSON.parse(evt.data);
        const event = jsonObj['event'];
        const action = jsonObj['action'];
        const context = jsonObj['context'];
        const jsonPayload = jsonObj['payload'];

        if(event == "keyUp")
        {
            const settings = jsonPayload['settings'];
            const coordinates = jsonPayload['coordinates'];
            const userDesiredState = jsonPayload['userDesiredState'];
            webhookAction.onKeyUp(context, settings, coordinates, userDesiredState);
        }
        else if(event == "willAppear")
        {
            const settings = jsonPayload['settings'];
            const coordinates = jsonPayload['coordinates'];
            webhookAction.onWillAppear(context, settings, coordinates);
        }
        else if(event == "sendToPlugin") {

            if(jsonPayload['type'] == "updateSettings") {

                webhookAction.SetSettings(context, jsonPayload);
                settingsCache[context] = jsonPayload;

            } else if(jsonPayload['type'] == "requestSettings") {

                webhookAction.SendSettings(action, context);
            }
        }
    };
};