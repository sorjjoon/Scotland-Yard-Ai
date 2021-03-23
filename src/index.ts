import express from "express";

import path from "path";

const main = async () => {
  console.log("Setting up server");
  
  const port = 5000;
  const app = express();

  //Not an useless import, force gamemap to be loaded here
  var consts = require("./constant");
  consts.gameMap.getNode(2)


  app.set("view engine", "ejs");
  
  app.use("/public", express.static(path.join(process.cwd(), "public")));

  app.get("/", function (req, res) {
    res.render("index", { title: "Hey", message: "Hello there!" });
  });

  app.listen(port, () => {
    console.log(`Setup success! Server is running at http://localhost:${port}`);
  });
};

main().catch((err) => {
  console.error(err);
});
