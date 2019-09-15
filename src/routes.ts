import Events from "./data/events";
import bbdays4it from "./data/bbdays4it";
import zadymkaJazzowa from "./data/zadymkaJazzowa";
import szlakiemMurali from "./data/szlakiemMurali";
import aktywnyWrzesien from "./data/aktywnyWrzesien";

const EventData = {
    bbdays4it,
    zadymkaJazzowa,
    szlakiemMurali,
    aktywnyWrzesien
};

export default {
    "GET": {
        "/": (queryStringParameters) => {
            return {
                ping: new Date().getTime(),
                params: queryStringParameters
            }
        },
        "/events": () => Events,
        "/events/bbdays4it": () => EventData.bbdays4it,
        "/events/zadymka-jazzowa": () => EventData.zadymkaJazzowa,
        "/events/aktywny-wrzesien": () => EventData.aktywnyWrzesien,
        "/events/szlakiem-murali": () => EventData.szlakiemMurali
    },
    "POST": {
        "/": (queryStringParameters, body) => {}
    }
};
