import Routes from "./routes";
const handlers = Routes;

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
