const express = require("express");

const app = express();

let riskOutage = false;

app.post("/risk/cause-outage", (req, res) => {
  riskOutage = true;
  res.end();
});

app.post("/risk/end-outage", (req, res) => {
  riskOutage = false;
  res.end();
});

app.post("/risk/calculate-order-risk", (req, res) => {
  if (riskOutage) {
    res.status(500);
    res.end();
    return;
  }

  res.send({
    score: 23,
  });
});

app.listen(3001, () => {
  console.log("Mocks ready at http://localhost:3001");
});
