import crypto from "crypto";

//1.
// function to generate salt
export function generateRandomSalt(length = 16) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]@~^|=-?/_><!'&%$#()";
  let salt = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    salt += charset.charAt(randomIndex);
  }
  return salt;
}

//2.
//function to combine password with salt
export function combinePasswordWithSalt(password, salt) {
  return password + salt;
}

//3.
//function to generate hash
export function generateHash(combinedString) {
  const hash = crypto.createHash("sha256");
  hash.update(combinedString);
  return hash.digest("hex");
}

