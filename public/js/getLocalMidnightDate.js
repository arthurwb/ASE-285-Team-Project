function getLocalMidnightDate() {
    let today = new Date();
    let isoDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    
    return isoDate;
}

function sendDate() {
    const date = getLocalMidnightDate();

    axios.post('/get-date', {date: date})
        .then((res) => {
            console.log(res);
            console.log('Server responded: ', res.data);
        })
        .catch((err) => {
            console.error(err);
        });
}

sendDate();