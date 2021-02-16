const express = require('express');
const app = express();
require('dotenv').config();
const router = require('./src/router/index');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors())
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '10mb',
}));

app.use('/img', express.static('upload/img'))
app.use(bodyParser.json({}));
app.use('/api/', cors(),router);
app.listen(process.env.PORT_ADDR, () => console.log(`Listenig on http://${process.env.ADDR_HOST}`))