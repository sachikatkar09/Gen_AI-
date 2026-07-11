require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");

connectToDB();

const path = require("path");
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
