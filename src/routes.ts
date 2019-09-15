import Events from "./data/events";
import bbdays4it from "./data/bbdays4it";

const EventData = {
    bbdays4it
};

export default {
    "GET": {
        "/": (queryStringParameters) => {
            return {
                ping: new Date().getTime()
            }
        },
        "/events": () => {
            return Events;
        },
        "/events/bbdays4it": () => {
            return EventData.bbdays4it;
        }
    },
    "POST": {
        "/": (queryStringParameters, body) => {}
    }
};
