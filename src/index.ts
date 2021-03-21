import express from "express";

import path from "path"
import { worker } from "./MCST/worker";

const main = async () => {
  console.log("Setting up server");
  

  const port = 5000;

  const app = express();
  app.set('view engine', 'ejs');
  app.use("/public", express.static(path.join(__dirname, 'public')));
  app.engine('html', require('ejs').renderFile);
  app.get('/', function (req, res) {
    res.render('index.html', { title: 'Hey', message: 'Hello there!' })
  })

  app.listen(port, () => {
    console.log(`Setup success! Server is running at http://localhost:${port}`);
  });
};

main().catch((err) => {
  console.error(err);
});
