/* **************************************************************
 * Slack Demo: Message clipping app using an action and a dialog
 *
 * Tomomi Imura (@girlie_mac)
 * **************************************************************/

'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const qs = require('qs');
const confirmation = require('./confirmation');
const exportNote = require('./exportNote');
const signature = require('./verifySignature');
const app = express();

const apiUrl = 'https://slack.com/api';

/*
 * Parse application/x-www-form-urlencoded && application/json
 * Use body-parser's `verify` callback to export a parsed raw body
 * that you need to use to verify the signature
 */

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

/*
/* Endpoint to receive an action and a dialog submission from Slack.
/* To use actions and dialogs, enable the Interactive Components in your dev portal.
/* Scope: `command` to enable actions
 */

app.post('/actions', (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const {type, user, view} = payload;
  if (!signature.isVerified(req)) {
    res.sendStatus(404);
    return;
  }

  if(type === 'message_action') {
    openModal(payload).then((result) => {
      if(result.data.error) {
        console.log(result.data);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    }).catch((err) => {
      res.sendStatus(500);
    });


  } else if (type === 'view_submission') {
    // immediately respond with a empty 200 response to let
    // Slack know the command was received
    res.send('');
    // create a ClipIt and prepare to export it to the theoritical external app
    exportNote.exportToJson(user.id, view);
    // DM the user a confirmation message
    confirmation.sendConfirmation(user.id, view);
  }
});

// open the dialog by calling dialogs.open method and sending the payload
const openModal = (payload) => {

  const viewData = {
    token: process.env.SLACK_ACCESS_TOKEN,
    trigger_id: payload.trigger_id,
    view: JSON.stringify({
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'Save it to ClipIt!'
      },
      callback_id: 'clipit',
      submit: {
        type: 'plain_text',
        text: 'ClipIt'
      },
      blocks: [
        {
          block_id: 'message',
          type: 'input',
          element: {
            action_id: 'message_id',
            type: 'plain_text_input',
            multiline: true,
            initial_value: payload.message.text
          },
          label: {
            type: 'plain_text',
            text: 'Message Text'
          }
        },
        {
          block_id: 'user',
          type: 'input',
          element: {
            action_id: 'user_id',
            type: 'users_select',
            initial_user: payload.message.user
          },
          label: {
            type: 'plain_text',
            text: 'Message Text'
          }
        },
        {
          block_id: 'importance',
          type: 'input',
          element: {
            action_id: 'importance_id',
            type: 'static_select',
            placeholder: {
              type: 'plain_text',
              text: 'Select importance',
              emoji: true
            },
            options: [
              {
                text: {
                  type: 'plain_text',
                  text: 'High 💎💎✨',
                  emoji: true
                },
                value: 'high'
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Medium 💎',
                  emoji: true
                },
                value: 'medium'
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Low ⚪️',
                  emoji: true
                },
                value: 'low'
              }
            ]
          },
          label: {
            type: 'plain_text',
            text: 'Importance'
          }
        }
      ]
    })
  };

  // open the dialog by calling dialogs.open method and sending the payload
  const promise = axios.post(`${apiUrl}/views.open`, qs.stringify(viewData));
  return promise;
};

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
