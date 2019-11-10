const express = require('express');
const helmet = require('helmet');
const app = express();

const { config } = require('./config');

const authApi = require('./routes/auth');
const platziStore = require('./routes/index')

// body parser
app.use(express.json());
app.use(helmet());

app.get('/', (req, res) => {
  let userInfo = req.header("user-agent");
  res.send(`UserInfo: ${userInfo}`);
});

// Routes
authApi(app);
platziStore(app);

app.listen(config.port, err => {
  if (err) {
    console.error("Error: ", err);
    return;
  }
  console.log(`Listening http://localhost:${config.port}`);
});