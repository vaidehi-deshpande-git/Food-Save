const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  let filePath = "";

  if (req.url === "/") {
    filePath = "index.html";
  } else if (req.url === "/style.css") {
    filePath = "style.css";
  } else if (req.url === "/script.js") {
    filePath = "script.js";
  } else {
    res.writeHead(404);
    res.end("Page Not Found");
    return;
  }

  const fullPath = path.join(__dirname, filePath);

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Server Error");
      return;
    }

    let contentType = "text/html";

    if (filePath.endsWith(".css")) {
      contentType = "text/css";
    } else if (filePath.endsWith(".js")) {
      contentType = "text/javascript";
    }

    res.writeHead(200, {
      "Content-Type": contentType,
    });

    res.end(data);
  });
});

server.listen(4000, () => {
  console.log("FoodSave Server running on port 4000");
});
