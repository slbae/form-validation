// Generates a preview of the image upload and performs front-end validation
// for the phone number, email, and expiration date fields.

// Generate a preview of the image file uploaded by the user
function previewImage(event) {
    let input = event.target;
    let image = document.getElementById('preview');
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            image.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// Handles the radio buttons and their input validation
document.addEventListener('DOMContentLoaded', function () {
    const notifyEmail = document.getElementById('notifyEmail');
    const emailInput = document.getElementById('email');
    const notifySMS = document.getElementById('notifySMS');
    const phoneInput = document.getElementById('phoneNumber');

    // If the email radio button was clicked, make the email input field required
    notifyEmail.addEventListener('click', function () {
        emailInput.setAttribute('required', true);
        phoneInput.removeAttribute('required');
    });

    // If the sms radio button was clicked, make the phone # input field required
    notifySMS.addEventListener('click', function () {
        phoneInput.setAttribute('required', true);
        emailInput.removeAttribute('required');
    });
});

// Validate the expiration date as the input changes. Display an error msg if the entered date is expired
document.getElementById('expiration').addEventListener('blur', function () {
    let expirationInput = document.getElementById('expiration').value;
    let error = document.getElementById("expirationError");

    // Split the input value into month and year parts
    let parts = expirationInput.split('/');
    let month = parseInt(parts[0]);
    let year = parseInt(parts[1]);

    // Handle two-digit year, assume it's in the current century
    if (year < 100) {
        year += 2000; // Adjust to current century
    }

    // Create a new Date object using the extracted month and year
    let expirationDate = new Date(year, month - 1, 1); // Expiration date is in MM/YY format

    // Get the current date
    let currentDate = new Date();

    // If the expiration date is expired, display error msg
    if (expirationDate <= currentDate) {
        error.innerText = "The card is expired.";
    }
    else {
        error.innerText = ""; // Not expired, remove error msg
    }
});
