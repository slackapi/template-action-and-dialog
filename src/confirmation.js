'use strict';

const axios = require('axios');
const qs = require('qs');
const users = require('./users');

const apiUrl = 'https://slack.com/api';
const slackAuthToken = process.env.SLACK_AUTH_TOKEN;

/*
 *  Send confirmation creation confirmation via
 *  chat.postMessage to the user who created it
 */

const sendConfirmation = (confirmation) => {
   let attachments = [
     {
       title: 'Message clipped!',
       // This should be the link in the ClipIt web app
       title_link: 'http://example.com/userID/message',
       fields: [
         {
           title: 'Message',
           value: confirmation.message
         },
         {
           title: 'Posted by',
           value: confirmation.send_by,
           short: true
         },
         {
           title: 'Importance',
           value: confirmation.importance,
           short: true
         },
       ],
     },
   ];

   let message = {
     token: slackAuthToken,
     channel: confirmation.userId,
     attachments: JSON.stringify(attachments)
   };

   axios.post(`${apiUrl}/chat.postMessage`, qs.stringify(message))
    .catch((err) => {
      console.log(err);
    });
 }

// Create helpdesk confirmation. Call users.find to get the user's email address
// from their user ID
const createConfirmation = (userId, submission) => {
  const confirmation = {
    userId: userId,
    message: submission.message,
    send_by:submission.send_by,
    importance: submission.importance
  };
  sendConfirmation(confirmation);
}

module.exports = { createConfirmation, sendConfirmation };
