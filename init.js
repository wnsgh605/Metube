import dotenv from "dotenv";
dotenv.config();
import "./db";
import app from "./app";

import "./models/Videos";
import "./models/Comment";
import "./models/User";

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`✔ Listening on: http://localhost:${PORT}`);

handleListening();
app.listen(PORT);
