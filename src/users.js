'use strict';

const axios = require('axios');
const qs = require('qs');

const apiUrl = 'https://slack.com/api';

/*
 *  Get user info from users.info method
 */

const find = (userId) => {
  const data = {
    token: process.env.SLACK_ACCESS_TOKEN,
    user: userId
  };
  const promise = axios.post(`${apiUrl}/users.info`, qs.stringify(data));
  return promise;
};

module.exports = { find };
