const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { ObjectId, Client, Collection } = require("./Database/mongodb");
const { exec } = require("child_process");
const app = express();
const port = process.env.PORT || 8000;
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/applications/all", async (req, res) => {
  await Client.connect();
  try {
    let data = await Collection.find().toArray();
    if (data) {
      return res
        .status(200)
        .json({ status: true, message: "Data fetched successfully", data });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  } finally {
    await Client.close();
  }
});
app.post("/api/applications/store", async (req, res) => {
  await Client.connect();
  const { path, parameters } = req.body;
  try {
    let store = await Collection.insertOne({
      path,
      parameters,
      createdAt: Date(),
    });
    if (store) {
      return res
        .status(200)
        .json({ status: true, message: "Application added successfully" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  } finally {
    await Client.close();
  }
});

// Route to launch applications
app.post("/api/application/launch", async (req, res) => {
  const { application, parameter } = req.body;
  let browser = "";
  if (application.includes("chrome")) {
    browser = "start chrome ";
  } else if (application.includes("microsoft-edge")) {
    browser = "start microsoft-edge:";
  }
  exec(`${browser}"https://${parameter}"`, (error, stdout, stderr) => {
    if (error) {
      console.log(`Error: ${error.message}`);
      return res.status(500).json({
        status: false,
        message: "Invalid directory... please select right path directory",
      });
    }
    if (stderr) {
      console.log(`stdError: ${stderr}`);
      return res
        .status(500)
        .json({ status: false, message: "Error launching application" });
    }
    console.log(`Application launched successfully ${parameter}`);
    return res
      .status(200)
      .json({
        status: true,
        message: `Application launched successfully ${parameter}`,
      });
  });
});

app.listen(port, () => {
  console.log(`Server is running into port: ${port}`);
});
