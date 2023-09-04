require('dotenv').config({ path: '.env' });
import App from "./src/app";

const app = new App();
app.start();