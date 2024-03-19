const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({ dest: 'static/uploads/' });
const app = express();
const PORT = 80;

const html_path = __dirname + '/templates/form.html';

// Set up Middleware
app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes

// Send the form page
app.get('/', (req, res) => {
    res.sendFile(html_path);
});

// Performs server-side validation and submits the form if successful.
app.post('/send', upload.single("fileInput"), (req, res) => {
    // Stu(art) Dent is a banned user he cannot send a payment
    if (req.body.senderFirstName && req.body.senderLastName &&
        ((req.body.senderFirstName.toLowerCase() === "stu" || req.body.senderFirstName.toLowerCase() === "stuart") &&
            (req.body.senderLastName.toLowerCase() === "dent"))) {
        // Delete the uploaded file if the sender's name is "Stu Dent" or "Stuart Dent"
        fs.unlink(req.file.path, err => {
            if (err) {
                console.error("Error deleting file:", err);
            } else {
                console.log("File deleted successfully:", req.file.path);
            }
        });
        // Send error page
        res.sendFile(path.join(__dirname, '/templates/error.html'));
    }
    else if (req.body.expiration) { // Check expiration date
        // Create a Date object for the entered date
        var parts = req.body.expiration.split('/');
        var month = parseInt(parts[0]);
        var year = parseInt(parts[1]);
        var expirationDate = new Date(year, month - 1, 1);

        // Handle two-digit year, assume it's in the current century
        if (year < 100) {
            year += 2000; // Adjust to current century
        }

        // Create a new Date object using the extracted month and year
        var expirationDate = new Date(year, month - 1, 1); // Expiration date is in MM/YY format
        var currentDate = new Date();

        // Send the success or error page
        if (expirationDate <= currentDate) {
            // Card is expired
            res.sendFile(path.join(__dirname, '/templates/error.html'));
        } else {
            // Successfully submitted the form and uploaded the image
            res.sendFile(path.join(__dirname, '/templates/success.html'));
        }
    }
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
