require('dotenv').config();
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware for cross-origin requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Helper functions
function isNumber(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}

function isAlphabetic(char) {
    return /^[a-zA-Z]$/.test(char);
}

function isSpecialCharacter(char) {
    return !/^[a-zA-Z0-9]$/.test(char);
}

function createConcatString(alphabets) {
    let allChars = [];
    alphabets.forEach(item => {
        for (let char of item) {
            if (isAlphabetic(char)) {
                allChars.push(char.toLowerCase());
            }
        }
    });
    
    allChars.reverse();
    
    let result = '';
    for (let i = 0; i < allChars.length; i++) {
        if (i % 2 === 0) {
            result += allChars[i].toUpperCase();
        } else {
            result += allChars[i].toLowerCase();
        }
    }
    
    return result;
}

// POST /bfhl endpoint
app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;
        
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input: 'data' must be an array"
            });
        }

        const oddNumbers = [];
        const evenNumbers = [];
        const alphabets = [];
        const specialCharacters = [];
        let sum = 0;

        data.forEach(item => {
            const itemStr = String(item);
            
            if (isNumber(itemStr)) {
                const num = parseInt(itemStr);
                sum += num;
                
                if (num % 2 === 0) {
                    evenNumbers.push(itemStr);
                } else {
                    oddNumbers.push(itemStr);
                }
            } else if (itemStr.length === 1 && isAlphabetic(itemStr)) {
                alphabets.push(itemStr.toUpperCase());
            } else if (itemStr.length > 1) {
                let allAlphabetic = true;
                for (let char of itemStr) {
                    if (!isAlphabetic(char)) {
                        allAlphabetic = false;
                        break;
                    }
                }
                if (allAlphabetic) {
                    alphabets.push(itemStr.toUpperCase());
                } else {
                    specialCharacters.push(itemStr);
                }
            } else if (isSpecialCharacter(itemStr)) {
                specialCharacters.push(itemStr);
            }
        });

        const concatString = createConcatString(alphabets);

        const response = {
            is_success: true,
            user_id: process.env.USER_ID || "nishchal_naithani_03052004",
            email: process.env.EMAIL || "nishchal.22bce8449@vitapstudent.ac.in",
            roll_number: process.env.ROLL_NUMBER || "22BCE8449",
            odd_numbers: oddNumbers,
            even_numbers: evenNumbers,
            alphabets: alphabets,
            special_characters: specialCharacters,
            sum: sum.toString(),
            concat_string: concatString
        };

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});

// GET /bfhl endpoint (health check)
app.get('/bfhl', (req, res) => {
    res.status(200).json({ 
        operation_code: 1 
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: "BFHL API is running",
        endpoints: {
            "GET /bfhl": "Health check - returns operation_code: 1",
            "POST /bfhl": "Process data array according to VIT requirements"
        }
    });
});

// Export for Vercel
module.exports = app;

// Local development server (won't run on Vercel)
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
