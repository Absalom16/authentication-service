// Encryption
// Function to generate a secret key of a specified length
export function generateSecretKey(length) {
  // Define the characters to be used in generating the secret key
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let secretKey = "";

  // Generate the secret key by randomly selecting characters from the defined characters set
  //This loop iterates length times. In each iteration, a random character is selected from
  // the characters string and appended to the secretKey.
  for (let i = 0; i < length; i++) {
    secretKey += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return secretKey;
}

// Function to map each character of the password to a specific character combination within the secret key

export function mapPasswordToSecretKey(password, secretKey) {
  const mappedPassword = [];

  // Iterate over each character in the password
  for (let i = 0; i < password.length; i++) {
    const char = password.charAt(i); //This line retrieves the character at the current index i from the password.

    // Calculate the index to ensure the secret key is repeated if it is shorter than the password
    const index = i % secretKey.length;

    // Get the ASCII code of the character in the secret key at the calculated index
    const shiftAmount = secretKey.charCodeAt(index); //The ASCII code is used as a "shift amount" to modify the ASCII code of the original character in the password.

    // Calculate the ASCII code of the mapped character by adding the shift amount to the ASCII code of the original character
    const mappedChar = String.fromCharCode(char.charCodeAt(0) + shiftAmount); //The String.fromCharCode() method is used to convert the resulting ASCII code back to a character.

    // Store the mapped character
    mappedPassword.push(mappedChar);
  }
  // Convert the array of mapped characters to a string
  return mappedPassword.join("");
}
