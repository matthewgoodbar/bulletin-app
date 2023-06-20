
const formatArray = arr => {
    const formatted = {}
    for (let i = 0; i < arr.length; i++) {
        formatted[arr[i].id] = arr[i];
    }
    return formatted;
};

module.exports = { formatArray };