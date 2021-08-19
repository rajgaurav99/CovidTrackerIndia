require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Set public folder as root
app.use(express.static('public'));

// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

app.get('*', function(req, res) {
  res.sendFile('./public/index.html', { root: __dirname })
});


app.all('/*', function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    response.header("Access-Control-Allow-Methods", "GET, POST", "PUT", "DELETE");
    next();
});
// Listen for HTTP requests on port 3000
app.listen(port, () => {
  console.log('listening on %d', port);
});
