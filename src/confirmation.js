'use strict';

const payloads = require('./payloads');
const api = require('./api');

/*
 *  Send confirmation via chat.postMessage to the user who clipped it
 */

const sendConfirmation = async (userId, view) => {
  let values = view.state.values;

  // open a DM channel with the user to receive the channel ID
  let user = await api.callAPIMethod('im.open', {
    user: userId
  });

  const messageData = payloads.confirmation({
    channel_id: user.channel.id,
    user_id: userId,
    selected_user_id: values.user.user_id.selected_user,
    message_id: values.message.message_id.value,
    importance: values.importance.importance_id.selected_option.text.text
  });

  await api.callAPIMethod('chat.postMessage', messageData);
}

module.exports = { sendConfirmation };
