import axios from "axios";
import readline from "readline";
import {
  generateSecretKey,
  mapPasswordToSecretKey,
} from "./utilities/encrypt.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to request username, email, and password
function requestUserData(callback) {
  const userData = {};

  rl.question("Enter your username: ", (username) => {
    userData.username = username;

    rl.question("Enter your email: ", (email) => {
      userData.email = email;

      rl.question("Enter your password: ", (password) => {
        userData.password = password;

        // Close the readline interface
        rl.close();

        // Pass the collected user data to the callback function
        callback(userData);
      });
    });
  });
}

// Start by requesting user data
requestUserData(addUser);

async function addUser(userData) {
  try {
    const username = userData.username;
    const password = userData.password;
    const email = userData.email;
    const secretKey = generateSecretKey(8);
    // Map the password to the secret key
    const encryptedPassword = mapPasswordToSecretKey(password, secretKey);

    const encryptedData = {
      username,
      email,
      secretKey,
      password: encryptedPassword,
    };
    const response = await axios.post(
      "http://localhost:3000/users",
      encryptedData
    );
    console.log("User added successfully:", response.data);
  } catch (error) {
    console.error("Error adding user:", error);
  }
}
