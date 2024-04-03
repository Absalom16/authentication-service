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
export function generateHash(input) {
  // Constants for SHA-256
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  // Initial hash values (first 32 bits of the fractional parts of the square roots of the first 8 primes)
  const H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
    0x1f83d9ab, 0x5be0cd19,
  ];

  // Helper functions for SHA-256 compression function
  // Right rotate operation for 32-bit integers
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));

  // Bitwise operations used in SHA-256 compression function
  const Sigma0 = (x) => rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22);

  // Bitwise operations used in SHA-256 compression function
  const Sigma1 = (x) => rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25);

  // Bitwise operations used in SHA-256 compression function
  const sigma0 = (x) => rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3);

  // Bitwise operations used in SHA-256 compression function
  const sigma1 = (x) => rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10);

  // Pre-processing: padding the message to a multiple of 512 bits
  let paddedMessage = unescape(encodeURIComponent(input));
  const messageLength = paddedMessage.length * 8;
  paddedMessage += String.fromCharCode(0x80);
  while ((paddedMessage.length * 8) % 512 !== 448) {
    paddedMessage += String.fromCharCode(0);
  }
  paddedMessage += String.fromCharCode(
    (messageLength >>> 56) & 0xff,
    (messageLength >>> 48) & 0xff,
    (messageLength >>> 40) & 0xff,
    (messageLength >>> 32) & 0xff,
    (messageLength >>> 24) & 0xff,
    (messageLength >>> 16) & 0xff,
    (messageLength >>> 8) & 0xff,
    messageLength & 0xff
  );

  // Process each 512-bit chunk
  for (
    let chunkStart = 0;
    chunkStart < paddedMessage.length;
    chunkStart += 64
  ) {
    let W = new Array(64).fill(0);
    // Break the chunk into 16 32-bit words
    for (let t = 0; t < 16; t++) {
      W[t] =
        (paddedMessage.charCodeAt(chunkStart + t * 4) << 24) |
        (paddedMessage.charCodeAt(chunkStart + t * 4 + 1) << 16) |
        (paddedMessage.charCodeAt(chunkStart + t * 4 + 2) << 8) |
        paddedMessage.charCodeAt(chunkStart + t * 4 + 3);
    }
    // Extend the 16 32-bit words to 64 words using specific algorithm
    for (let t = 16; t < 64; t++) {
      W[t] =
        (sigma1(W[t - 2]) + W[t - 7] + sigma0(W[t - 15]) + W[t - 16]) &
        0xffffffff;
    }

    let [a, b, c, d, e, f, g, h] = H;
    // Apply SHA-256 compression function to each chunk
    for (let t = 0; t < 64; t++) {
      const T1 =
        (h + Sigma1(e) + ((e & f) ^ (~e & g)) + K[t] + W[t]) & 0xffffffff;
      const T2 = (Sigma0(a) + ((a & b) ^ (a & c) ^ (b & c))) & 0xffffffff;
      h = g;
      g = f;
      f = e;
      e = (d + T1) & 0xffffffff;
      d = c;
      c = b;
      b = a;
      a = (T1 + T2) & 0xffffffff;
    }

    // Update hash values for this chunk
    H[0] = (H[0] + a) & 0xffffffff;
    H[1] = (H[1] + b) & 0xffffffff;
    H[2] = (H[2] + c) & 0xffffffff;
    H[3] = (H[3] + d) & 0xffffffff;
    H[4] = (H[4] + e) & 0xffffffff;
    H[5] = (H[5] + f) & 0xffffffff;
    H[6] = (H[6] + g) & 0xffffffff;
    H[7] = (H[7] + h) & 0xffffffff;
  }

  // Output hash value
  let hash = "";
  // Concatenate the final hash values to form the output hash
  for (let i = 0; i < 8; i++) {
    hash += ("00000000" + H[i].toString(16)).slice(-8);
  }
  return hash;
}