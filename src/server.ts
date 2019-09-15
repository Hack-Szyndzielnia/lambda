import * as express from "express";
import * as bodyParser from "body-parser";
import * as Lambda from "./lambda";

class Server {
	private app: express.Application;

	/**
	 * Bootstrap the application.
	 *
	 * @class Server
	 * @method bootstrap
	 * @static
	 * @return {Server} Returns the newly created injector for this app.
	 */
	public static bootstrap(): Server {
		return new Server();
	}

	/**
	 * Constructor.
	 *
	 * @class Server
	 * @constructor
	 */
	constructor() {
		this.app = express();
		this.config();
		this.routing();
	}

	/**
	 * Configures express app
	 *
	 * @void
	 */
	config() {
		const port = process.env.PORT || 80;

		this.app.use(bodyParser.urlencoded({
			extended: true
		}));
		this.app.use(bodyParser.json());
		this.app.listen(port, () => console.log(`Server is listening on port: ${port}`));
	}

	routing() {
		this.app.all("/*", async (req, res, next) => {
			const event = {
				"body": req.body,
				"httpMethod": req.method,
				"queryStringParameters": req.query,
				"path": req.path
			};
			await Lambda.handler(event, {}, (error, lambdaResponse: {headers: any, statusCode: number, body: any}) => {
				if (error) {} else {
					res
						.set(lambdaResponse.headers)
						.status(lambdaResponse.statusCode)
						.send(lambdaResponse.body);
				}
			});
			next();
		});
	}
}

Server.bootstrap();
