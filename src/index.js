/* **************************************************************
 * Slack Demo: Message clipping app using an action and a dialog
 *
 * Tomomi Imura (@girlie_mac)
 * **************************************************************/

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const qs = require('qs');
const users = require('./users');
const confirmation = require('./confirmation');
const exportNote = require('./exportNote');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const slackVerificationToken = process.env.SLACK_VERIFICATION_TOKEN;
const slackAuthToken = process.env.SLACK_AUTH_TOKEN;

const apiUrl = 'https://slack.com/api';


/*
/* Endpoint to receive an action and a dialog submission from Slack.
/* To use actions and dialogs, enable the Interactive Components in your dev portal.
/* Scope: `command` to enable actions
 */

app.post('/actions', (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const {token, type, user, submission} = payload;
  //console.log(payload);

  if(type === 'message_action') {
    if (token !== slackVerificationToken) {
      res.sendStatus(401);
    } else {
      // Get user info of the person who posted the original message from the payload
      const getUserInfo = new Promise((resolve, reject) => {
        users.find(payload.message.user).then((result) => {
          //console.log(result.data);
          resolve(result.data.user.profile.real_name);
        }).catch((err) => { reject(err); });
      });

      // Once successfully get the user info, open a dialog with the info
      getUserInfo.then((userInfoResult) => {
        openDialog(payload, userInfoResult).then((result) => {
          if(result.data.error) {
            console.log(result.data);
            res.sendStatus(500);
          } else {
            res.sendStatus(200);
          }
        }).catch((err) => {
          res.sendStatus(500);
        });

      })
      .catch((err) => { console.error(err); });

    }
  } else if (type === 'dialog_submission') {
    if (token !== slackVerificationToken) {
      res.sendStatus(401);
    } else {
      // immediately respond with a empty 200 response to let
      // Slack know the command was received
      res.send('');
      // create a ClipIt and prepare to export it to the theoritical external app
      exportNote.exportToJson(submission);
      // DM the user a confirmation message
      confirmation.createConfirmation(user.id, submission);
    }
  }
});

// open the dialog by calling dialogs.open method and sending the payload
const openDialog = (payload, real_name) => {

  const dialogData = {
    token: slackAuthToken,
    trigger_id: payload.trigger_id,
    dialog: JSON.stringify({
      title: 'Save it to ClipIt!',
      callback_id: 'clipit',
      submit_label: 'ClipIt',
      elements: [
         {
           label: 'Message Text',
           type: 'textarea',
           name: 'message',
           value: payload.message.text
         },
         {
           label: 'Posted by',
           type: 'text',
           name: 'send_by',
           value: `${real_name}`
         },
         {
           label: 'Importance',
           type: 'select',
           name: 'importance',
           value: 'Medium 💎',
           options: [
             { label: 'High', value: 'High 💎💎✨' },
             { label: 'Medium', value: 'Medium 💎' },
             { label: 'Low', value: 'Low ⚪️' }
           ],
         },
      ]
    })
  };

  // open the dialog by calling dialogs.open method and sending the payload
  const promise = axios.post(`${apiUrl}/dialog.open`, qs.stringify(dialogData));
  return promise;
};
