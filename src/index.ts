import app from "./app";
import mongoose from "mongoose";
import process from "process";

const port = process.env.PORT || 5000;

app.listen(port, () => {
  mongoose.connect(process.env.MONGO_URL!).then(() => {
    console.log("DB Connected");
  });
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
