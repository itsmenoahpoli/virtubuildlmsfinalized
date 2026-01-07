import { runApp } from "./src/app.bootstrap";

(async () => {
	try {
		await runApp();
	} catch (error) {
		console.error(`[ERROR]: Failed to start application server`, error);
	}
})();
