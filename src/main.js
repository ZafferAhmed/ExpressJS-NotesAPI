require("dotenv").config();
const express = require("express");
const app = express();
const noteRouter = require("./Routes/noteRoutes");
const userRouter = require("./Routes/userRoutes");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

app.use(express.json());

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/users", userRouter);
app.use("/notes", noteRouter);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Express API",
      version: "1.0.0",
      description: "API documentation for my Express.js project",
    },
    tags: [
      { name: "Users", description: "Operations related to users" },
      { name: "Notes", description: "Operations related to notes" },
    ],
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./src/Routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.send(
    "Notes API is live! Easily perform Create, Read, Update, and Delete operations."
  );
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
