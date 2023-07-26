import { app } from "./app";
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT || port, () => {
  console.log("connected to port", process.env.PORT);
});
