// Decryption
// Function to reverse the mapping and retrieve the original password from the mapped password
export function reverseMapPassword(mappedPassword, secretKey) {
  const originalPassword = [];

  // Iterate over each character in the mapped password
  for (let i = 0; i < mappedPassword.length; i++) {
    const char = mappedPassword.charAt(i);

    // Calculate the index to ensure the secret key is repeated if shorter than the mapped password
    const index = i % secretKey.length;

    // Get the ASCII code of the character in the secret key at the calculated index
    const shiftAmount = secretKey.charCodeAt(index);

    // Calculate the ASCII code of the original character by subtracting the shift amount from the ASCII code of the mapped character
    const originalChar = String.fromCharCode(char.charCodeAt(0) - shiftAmount);
    
    // Store the original character
    originalPassword.push(originalChar);
  }
  // Convert the array of original characters to a string
  return originalPassword.join("");
}
