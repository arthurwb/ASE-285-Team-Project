function randomDate() {
    // Setting start year for 2024 since program created in 2024
    const startYear = 2024;

    // Generate a random year from 2024 onwards
    const year = Math.floor(Math.random() * 100) + startYear;

    // Generate a random month
    const month = Math.floor(Math.random() * 12);

    // Generate a random day
    const day = Math.floor(Math.random() * (new Date(year, month + 1, 0).getDate())) + 1;

    // Create date object with time set to midnight (we are only wanting to get a random date, not a random time)
    return new Date(year, month, day, 0, 0, 0);
}

module.exports = randomDate;