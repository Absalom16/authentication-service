import express from "express";
import dotenv from "dotenv";
import {
  addUser,
  authenticateUser,
  checkEmailExists,
  combinePasswordWithSalt,
  generateHash,
  generateRandomSalt,
  getUser,
} from "./utilities/helpers.js";
const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json(), function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      res.send({ message: "Email already exists. Try another one" });
      return;
    }

    //generate salt
    const salt = generateRandomSalt();

    //combine salt with password
    const combinedString = combinePasswordWithSalt(password, salt);

    //generate hashed password
    const hashedPassword = generateHash(combinedString);

    // Create an object containing the user's data along with the encrypted password
    const userData = {
      name: name,
      email: email,
      salt,
      password: hashedPassword,
    };

    // Add the user by making a POST request to the server
    const response = await addUser(userData);
    // Log a success message if the user was added successfully
    res.send({ message: "User added successfully:", data: response.data });
    return;
  } catch (e) {
    console.log(e);
  }
});

// Add a new user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user data based on the provided email
    const userData = await getUser(email);

    if (userData) {
      // Authenticate the user with the provided password
      const isValid = await authenticateUser(userData, password);
      // Notify the user of the authentication result
      if (isValid) {
        res.send({ message: "Successful authentication" });
      } else {
        res.send({ message: "Failed authentication" });
      }
    } else {
      // Notify the user that the user with the provided email was not found
      res.send({ message: "User not found" });
      return;
    }
  } catch (e) {
    console.log(e);
  }
});

// Create HTTP server with Express
app.listen(PORT, () => {
  console.log(`Auth server is running on port ${PORT}`);
});
