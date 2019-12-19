/* **************************************************************
 * Slack Demo: Message clipping app using an action and a dialog
 *
 * Tomomi Imura (@girlie_mac)
 * **************************************************************/

'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const confirmation = require('./confirmation');
const exportNote = require('./exportNote');
const signature = require('./verifySignature');
const payloads = require('./payloads');
const api = require('./api');
const app = express();

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

app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

/*
/* Endpoint to receive an action and a dialog submission from Slack.
/* To use actions and dialogs, enable the Interactive Components in your dev portal.
/* Scope: `command` to enable actions
 */

app.post('/actions', async (req, res) => {
  if (!signature.isVerified(req)) return res.status(404).send();

  const payload = JSON.parse(req.body.payload);
  const { type, user, view } = payload;

  switch (type) {
    case 'message_action':
      let result = await openModal(payload)
      if (result.error) {
        console.log(result.error);
        return res.status(500).send();
      }
      return res.status(200).send();
    case 'view_submission':
      // immediately respond with a empty 200 response to let
      // Slack know the command was received
      res.send('');
      // create a ClipIt and prepare to export it to the theoritical external app
      exportNote.exportToJson(user.id, view);
      // DM the user a confirmation message
      confirmation.sendConfirmation(user.id, view);
      break;
  }
});

// open the dialog by calling dialogs.open method and sending the payload
const openModal = async (payload) => {

  const viewData = payloads.openModal({
    trigger_id: payload.trigger_id,
    user_id: payload.message.user,
    text: payload.message.text
  })

  return await api.callAPIMethod('views.open', viewData)
};


const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
