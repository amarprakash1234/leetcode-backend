const express = require("express");
const app = express();
// require("dotenv").config();
const main = require("./config/db");
const redisClient = require("./config/redis");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problem");
const submitRouter = require("./routes/submission");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreator");
const cors = require("cors");


app.use(cors({ // Yha pr bta rhe h ki jo v mai data serve krne wala hu wo sirf es domain+port ko krne wala hu becoz mera frontend es wale ip pr hosted hai.
   origin:"http://localhost:5173", // If aap chahte h ki koi v mere data ko access kr skta hai to aap "*" de skte hai.
   credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);


const initializeConnection = async () => {
   try {
      await Promise.all([redisClient.connect(), main()]);
      console.log("DB Connected");
      app.listen(process.env.PORT, () => {
         console.log("Server is listening at port number : ", process.env.PORT);
      });
   } catch(err) {
      console.log(`Error -> ${err.message}`);
   }
}

initializeConnection();

