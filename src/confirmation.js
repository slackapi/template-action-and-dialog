'use strict';

const axios = require('axios');
const qs = require('qs');

const apiUrl = 'https://slack.com/api';

/*
 *  Send confirmation via chat.postMessage to the user who clipped it
 */

// Currently, Actions + DM combo has known issue when you're using the workspace tokens
// DM works for the user installed the app, and only after other user manually add the app
// We are still investing the issue

const sendConfirmation = (userId, data) => {
   let attachments = [
     {
       title: 'Message clipped!',
       // This should be the link in the ClipIt web app
       title_link: `http://example.com/${userId}/clip`,
       fields: [
         {
           title: 'Message',
           value: data.message
         },
         {
           title: 'Posted by',
           value: data.send_by,
           short: true
         },
         {
           title: 'Importance',
           value: data.importance,
           short: true
         },
       ],
     },
   ];

   let message = {
     token: process.env.SLACK_ACCESS_TOKEN,
     channel: userId,
     as_user: true,
     attachments: JSON.stringify(attachments)
   };

   axios.post(`${apiUrl}/chat.postMessage`, qs.stringify(message))
    .then((result => {
      console.log(result.data);
    }))
    .catch((err) => {
      console.log(err);
    });
 }

module.exports = { sendConfirmation };
