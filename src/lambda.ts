import * as services from "./services";
import CCBS from "./src/CCBS";

let ccbsService: CCBS;

let optionalMethodArguments = [];
function bindQueryStringParameters(queryStringParameters, paramList: Array<string>) {
    if (queryStringParameters && paramList.length) {
        for (let item of paramList) {
            if (queryStringParameters.hasOwnProperty(item)) {
                optionalMethodArguments.push(queryStringParameters[item]);
            } else {
                break;
            }
        }
    }
}

const handlers = {
    "GET": {
        "/listSubscriptionUsers": (queryStringParameters) => {
            bindQueryStringParameters(queryStringParameters, ["page", "pageSize"]);
            return ccbsService.listSubscriptionUsers(queryStringParameters.subscriptionID, ...optionalMethodArguments);
        },
        "/listSubscriptions": (queryStringParameters) => {
            bindQueryStringParameters(queryStringParameters, ["page", "pageSize"]);
            return ccbsService.listSubscriptions(...optionalMethodArguments);
        },
        "/getUserData": (queryStringParameters) => {
            return ccbsService.getUserData(
                queryStringParameters.userID
            );
        },
        "/getSubscription": (queryStringParameters) => {
            return ccbsService.getSubscription(
                queryStringParameters.subscriptionID
            );
        },
        "/listAuthorizedUsers": async() => {
            return services.authorizedUsers.list();
        }
    },
    "POST": {
        "/createSubscription": (queryStringParameters, body) => {
            return ccbsService.createSubscription(
                body.companyName,
                body.adminEmail,
                body.country
            );
        },
        "/createUser": (queryStringParameters, body) => {
            return ccbsService.createUser(
                body.email,
                body.firstName,
                body.lastName,
                body.displayName,
                body.locale
            );
        },
        "/attachUserToSubscription": (queryStringParameters, body) => {
            return ccbsService.attachUserToSubscription(
                body.subscriptionID,
                body.userID,
                body.role
            );
        },
        "/saveAuthorizedUser": (queryStringParameters, body) => {
            return services.authorizedUsers.add(body.email);
        }
    },
    "DELETE": {
        "/removeUserSubscription": (queryStringParameters) => {
            return ccbsService.removeUserSubscription(
                queryStringParameters.subscriptionID,
                queryStringParameters.userID
            );
        },
        "/removeAuthorizedUser": (queryStringParameters) => {
            return services.authorizedUsers.remove(queryStringParameters.email);
        }
    }
};

const responseHeaders = {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Credentials" : true,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, DELETE",
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": 0
};

export const handler = async (
    event: any = {},
    context: any = {},
    callback: any = () => {}
): Promise<any> => {
    let { path, httpMethod, queryStringParameters, body } = event;
    let environment = "qa";
    if (path) {
        environment = path.replace(/^\/([^\/]+)\/.*/, "$1");
        path = path.replace(/^\/([^\/]+)/, "");
    }

    switch (environment) {
        case "prod":
            ccbsService = services.ccbsProd;
            break;
        case "qa":
        default:
            ccbsService = services.ccbsQa;
    }

    await ccbsService.init();

    let response = {
        body: {},
        headers: responseHeaders,
        statusCode: 405
    };

    try {
        if (handlers.hasOwnProperty(httpMethod) && handlers[httpMethod].hasOwnProperty(path)) {
            response.body = JSON.stringify(await handlers[httpMethod][path](queryStringParameters, body));
            response.statusCode = 200;
        } else if (httpMethod === "OPTIONS") {
            response.statusCode = 200;
        } else {
            response.body = JSON.stringify({
                message: `Invalid HTTP Method: ${httpMethod}`
            });
        }
    } catch (error) {
        response.body = JSON.stringify(error);
        response.statusCode = 500;
        console.error(error);
    }

    callback(null, response);
};
