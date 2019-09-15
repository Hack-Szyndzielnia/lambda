import Events from "./data/events";

export default {
    "GET": {
        "/": (queryStringParameters) => {
            return {
                ping: new Date().getTime()
            }
        },
        "/events": () => {
            return Events;
        }
    },
    "POST": {
        "/": (queryStringParameters, body) => {}
    }
};
