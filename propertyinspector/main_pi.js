let websocket = null,
    uuid = null,
    actionInfo = {};

function connectSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
    uuid = inUUID;

    actionInfo = JSON.parse(inActionInfo);
    websocket = new WebSocket('ws://localhost:' + inPort);

    websocket.onopen = function () {
        const json = {
            event:  inRegisterEvent,
            uuid:   inUUID
        };
        websocket.send(JSON.stringify(json));
        requestSettings();
    };

    websocket.onmessage = function (evt) {
        // Received message from Stream Deck
        const jsonObj = JSON.parse(evt.data);
        if (jsonObj.event === 'sendToPropertyInspector') {
            const payload = jsonObj.payload;
            if (payload.error) {
                return;
            }

            const ip = document.getElementById('ip');
            ip.value = payload.ip;

            const authtoken = document.getElementById('authtoken');
            authtoken.value = payload.authtoken;

            const domain = document.getElementById('domain');
            domain.value = payload.domain;

            const service = document.getElementById('service');
            service.value = payload.service;

            const data = document.getElementById('data');
            data.value = payload.data;

            if(ip.value == "undefined" || authtoken.value == "undefined" || domain.value == "undefined" || service.value == "undefined") {
                ip.value = "";
                authtoken.value = "";
                domain.value = "";
                service.value = "";
            }
            if(data.value == "undefined") {
                data.value = "";
            }

            const el = document.querySelector('.sdpi-wrapper');
            el && el.classList.remove('hidden');
        }
    };

}

function requestSettings() {
    if (websocket) {
        let payload = {};
        payload.type = "requestSettings";
        const json = {
            "action": actionInfo['action'],
            "event": "sendToPlugin",
            "context": uuid,
            "payload": payload,
        };
        websocket.send(JSON.stringify(json));
    }
}

function updateSettings() {
    if (websocket) {
        let payload = {};

        payload.type = "updateSettings";

        const ip = document.getElementById('ip');
        payload.ip = ip.value;

        const authtoken = document.getElementById('authtoken');
        payload.authtoken = authtoken.value;

        const domain = document.getElementById('domain');
        payload.domain = domain.value;

        const service = document.getElementById('service');
        payload.service = service.value;

        const data = document.getElementById('data');
        payload.data = data.value;

        console.log(payload);
        const json = {
            "action": actionInfo['action'],
            "event": "sendToPlugin",
            "context": uuid,
            "payload": payload,
        };
        websocket.send(JSON.stringify(json));
    }
}
