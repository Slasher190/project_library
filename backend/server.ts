import { app } from "./app";
import { v2 as cloudinaryV2 } from "cloudinary";
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.listen(process.env.PORT || port, () => {
  console.log("connected to port", process.env.PORT);
});
