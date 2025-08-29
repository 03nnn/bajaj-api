const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Helpers
const isNumber = (str) => !isNaN(str) && !isNaN(parseFloat(str));
const isAlphabetic = (char) => /^[a-zA-Z]$/.test(char);
const isSpecialCharacter = (char) => !/^[a-zA-Z0-9]$/.test(char);

function createConcatString(alphabets) {
  const allChars = [];
  alphabets.forEach(item => {
    for (const char of item) if (isAlphabetic(char)) allChars.push(char.toLowerCase());
  });
  allChars.reverse();
  let result = '';
  for (let i = 0; i < allChars.length; i++) {
    result += i % 2 === 0 ? allChars[i].toUpperCase() : allChars[i].toLowerCase();
  }
  return result;
}

// Routes
app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ is_success: false, error: "Invalid input: 'data' must be an array" });
    }

    const oddNumbers = [];
    const evenNumbers = [];
    const alphabets = [];
    const specialCharacters = [];
    let sum = 0;

    for (const item of data) {
      const s = String(item);
      if (isNumber(s)) {
        const n = parseInt(s);
        sum += n;
        (n % 2 === 0 ? evenNumbers : oddNumbers).push(s);
      } else if (s.length === 1 && isAlphabetic(s)) {
        alphabets.push(s.toUpperCase());
      } else if (s.length > 1) {
        let allAlpha = true;
        for (const ch of s) if (!isAlphabetic(ch)) { allAlpha = false; break; }
        allAlpha ? alphabets.push(s.toUpperCase()) : specialCharacters.push(s);
      } else if (isSpecialCharacter(s)) {
        specialCharacters.push(s);
      }
    }

    const concatString = createConcatString(alphabets);

    return res.status(200).json({
      is_success: true,
      user_id: process.env.USER_ID || "nishchal_naithani_03052004",
      email: process.env.EMAIL || "nishchal.22bce8449@vitapstudent.ac.in",
      roll_number: process.env.ROLL_NUMBER || "22BCE8449",
      odd_numbers: oddNumbers,
      even_numbers: evenNumbers,
      alphabets,
      special_characters: specialCharacters,
      sum: String(sum),
      concat_string: concatString
    });
  } catch {
    return res.status(500).json({ is_success: false, error: "Internal server error" });
  }
});

app.get('/bfhl', (_req, res) => res.status(200).json({ operation_code: 1 }));

app.get('/', (_req, res) => {
  res.json({
    message: "BFHL API is running",
    status: "active",
    endpoints: { "GET /bfhl": "Health check", "POST /bfhl": "Process data array" }
  });
});

module.exports = (req, res) => app(req, res);
