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
// Listen for HTTP requests on port 3000
app.listen(port, () => {
  console.log('listening on %d', port);
});
