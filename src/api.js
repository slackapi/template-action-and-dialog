const axios = require('axios');
const apiUrl = 'https://slack.com/api';

const callAPIMethod = async (method, payload) => {
    let result = await axios.post(`${apiUrl}/${method}`, payload, {
        headers: { Authorization: "Bearer " + process.env.SLACK_ACCESS_TOKEN }
    });
    return result.data;
}

module.exports = {
    callAPIMethod
}