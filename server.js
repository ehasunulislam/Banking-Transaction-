require("dotenv").config();

const app = require("./src/app");
const port = 3000;

const ConnectedDB = require("./src/config/db");
ConnectedDB();



app.listen(port, () => {
  console.log(`server is running on port ${port}`)
});