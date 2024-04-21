# Bryce User Manuals

## Feature 2: Password Encryption and User Data Sorage

User's passwords are securely encrypted upon sign up to ensure no user's data is leaked in the case of a data breach. The user's data is encrypted before being sent to the database to ensure that their information is not compromised if it is intercepted.

The password is encrypted using salt with 1000 iterations to ensure a secure key using the sha512 algorithm.
