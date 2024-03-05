import axios from "axios";
import readline from "readline";
import { reverseMapPassword } from "./utilities/decrypt.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to request username, email, and password
function requestUserData(callback) {
  const userData = {};

  rl.question("Enter your email: ", (email) => {
    userData.email = email;

    rl.question("Enter your password: ", (password) => {
      userData.password = password;

      // Pass the collected user data to the callback function
      callback(userData);
    });
  });
}

// Start by requesting user data
requestUserData(getUser);

async function getUser(userData) {
  try {
    const email = userData.email;
    const password = userData.password;
    const response = await axios.get("http://localhost:3000/users", {
      params: {
        email: email,
      },
    });

    const encryptedPassword = response.data[0].password;
    const secretKey = response.data[0].secretKey;

    const originalPassword = reverseMapPassword(encryptedPassword, secretKey);

    if (password == originalPassword) {
      //successfull login
      console.log("successfull authentication");
    } else {
      //unsuccessful authentication
      console.log("failed authentication");
    }
  } catch (error) {
    console.error("Error getting users:", error);
  }
}
