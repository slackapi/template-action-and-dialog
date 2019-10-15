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

const sendConfirmation = (userId, view) => {
  let values = view.state.values

  let blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Message clipped!*'
      }
    },
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Message*\n${values.message.message_id.value}`
      }
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `*Posted by* <@${values.user.user_id.selected_user}>`
        },
        {
          type: 'mrkdwn',
          text: `*Importance:* ${values.importance.importance_id.selected_option.text.text}`
        },
        {
          type: 'mrkdwn',
          // This should be the link in the ClipIt web app
          text: `*Link:* http://example.com/${userId}/clip`
        }
      ]
    }
  ];

   let message = {
     token: process.env.SLACK_ACCESS_TOKEN,
     channel: userId,
     as_user: true,
     blocks: JSON.stringify(blocks)
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
