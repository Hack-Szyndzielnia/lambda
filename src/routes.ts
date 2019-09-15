import Events from "./data/events";
import bbdays4it from "./data/bbdays4it";
import zadymkaJazzowa from "./data/zadymkaJazzowa";
import szlakiemMurali from "./data/szlakiemMurali";

const EventData = {
    bbdays4it,
    zadymkaJazzowa,
    szlakiemMurali
};

export default {
    "GET": {
        "/": (queryStringParameters) => {
            return {
                ping: new Date().getTime()
            }
        },
        "/events": () => Events,
        "/events/bbdays4it": () => EventData.bbdays4it,
        "/events/zadymka-jazzowa": () => EventData.zadymkaJazzowa,
        "/events/szlakiem-murali": () => EventData.szlakiemMurali
    },
    "POST": {
        "/": (queryStringParameters, body) => {}
    }
};
