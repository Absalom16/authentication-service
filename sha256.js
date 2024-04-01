// Define a function named sha256 that takes a message as input
function sha256(message) {
  // Define helper functions for various logical operations used in the SHA-256 algorithm
  // Right rotation operation
  function rotateRight(value, shift) {
    return (value >>> shift) | (value << (32 - shift));
  }
  // Various logical functions used in the SHA-256 algorithm
  function sigma0(value) {
    return (
      rotateRight(value, 2) ^ rotateRight(value, 13) ^ rotateRight(value, 22)
    );
  }
  function sigma1(value) {
    return (
      rotateRight(value, 6) ^ rotateRight(value, 11) ^ rotateRight(value, 25)
    );
  }
  function gamma0(value) {
    return rotateRight(value, 7) ^ rotateRight(value, 18) ^ (value >>> 3);
  }
  function gamma1(value) {
    return rotateRight(value, 17) ^ rotateRight(value, 19) ^ (value >>> 10);
  }
  // Logical functions used in the SHA-256 compression function
  function ch(x, y, z) {
    return (x & y) ^ (~x & z);
  }
  function maj(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
  }
  // Padding function to ensure message length is a multiple of 512 bits
  function preprocess(message) {
    message += String.fromCharCode(0x80); // Append a one-bit
    while (message.length % 64 !== 56) {
      // Pad with zeros until length is 56 mod 64
      message += String.fromCharCode(0x00);
    }
    // Append original message length in bits
    message += String.fromCharCode(
      (message.length >>> 29) & 0xff,
      (message.length >>> 21) & 0xff,
      (message.length >>> 13) & 0xff,
      (message.length >>> 5) & 0xff
    );
    return message;
  }
  message = preprocess(message); // Pad message
  // Initial hash values (first 32 bits of the fractional parts of the square roots of the first 8
  // primes)
  let H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
    0x1f83d9ab, 0x5be0cd19,
  ];
  // Define the constants used in SHA-256 algorithm
  let K = [
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
  // Main loop: process each 512-bit block
  for (let i = 0; i < message.length; i += 64) {
    // Break block into 16 32-bit words
    let words = [];
    for (let j = 0; j < 16; j++) {
      words[j] =
        ((message.charCodeAt(i + j * 4) & 0xff) << 24) |
        ((message.charCodeAt(i + j * 4 + 1) & 0xff) << 16) |
        ((message.charCodeAt(i + j * 4 + 2) & 0xff) << 8) |
        (message.charCodeAt(i + j * 4 + 3) & 0xff);
    }
    // Extend the first 16 words into the remaining 48 words
    for (let j = 16; j < 64; j++) {
      words[j] =
        gamma1(words[j - 2]) +
        words[j - 7] +
        gamma0(words[j - 15]) +
        words[j - 16];
    }
    // Initialize working variables to current hash value
    let a = H[0],
      b = H[1],
      c = H[2],
      d = H[3],
      e = H[4],
      f = H[5],
      g = H[6],
      h = H[7];
    // Compression function main loop
    for (let j = 0; j < 64; j++) {
      let T1 = h + sigma1(e) + ch(e, f, g) + K[j] + words[j];
      let T2 = sigma0(a) + maj(a, b, c);
      h = g;
      g = f;
      f = e;
      e = d + T1;
      d = c;
      c = b;
      b = a;
      a = T1 + T2;
    }
    // Add compressed chunk to current hash
    H[0] += a;
    H[1] += b;
    H[2] += c;
    H[3] += d;
    H[4] += e;
    H[5] += f;
    H[6] += g;
    H[7] += h;
  }
  // Convert hash to hexadecimal string
  let hash = "";
  for (let h of H) {
    hash += ("00000000" + h.toString(16)).slice(-8);
  }
  return hash; // Return the computed hash
}
// Test
const message = "Hello, SHA-256!";
const hash = sha256(message); // Compute SHA-256 hash of the message
console.log("Message:", message);
console.log("SHA-256 Hash:", hash); // Output the hash
