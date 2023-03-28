const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
//////////////////////////////
// FILES :
//Blocking synchronous way

// let textInput = "";
// textInput = fs.readFileSync("./txt/input.txt", "utf-8");
// const textOut = `this is what we knowss about the avocado: ${textInput}.\n Created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

// Non-blocking, asynchoruns way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) {
//     console.log("Error occuried");
//     return;
//   }
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("the final file was written!");
//       });
//     });
//   });
// });

//////////////////////////////
// SERVER:

// we can do this syncrynously because they are at the top level.
// we can't do this inside the createServer function because it's called each time...
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const query = url.parse(req.url, true).query;
  // overview page:
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }

  // product page:
  else if (pathName === `/product`) {
    res.writeHead(200, { "Content-type": "text/html" });
    let output;
    const product = dataObj.find((obj) => obj.id === +query.id);
    output = replaceTemplate(tempProduct, product);

    res.end(output);
  }
  // API:
  else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  }
  // NotFound page:
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1> No page found </h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests to port 8000");
});
