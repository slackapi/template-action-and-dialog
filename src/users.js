'use strict';

const axios = require('axios');
const qs = require('qs');

const apiUrl = 'https://slack.com/api';
const slackAuthToken = process.env.SLACK_AUTH_TOKEN;

/*
 *  Get user info from users.info method
 */

const find = (userId) => {
  const data = {
    token: slackAuthToken,
    user: userId
  };
  const promise = axios.post(`${apiUrl}/users.info`, qs.stringify(data));
  return promise;
};

module.exports = { find };
