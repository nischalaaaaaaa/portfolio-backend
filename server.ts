require('dotenv').config({ path: '.env' });
if(process.env.NEWRELIC_LICENSE_KEY) {
    require('newrelic');
}

import App from "./src/app";

const app = new App();

app.start();