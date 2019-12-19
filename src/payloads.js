module.exports = {
    openModal: context => {
        return {
            token: process.env.SLACK_ACCESS_TOKEN,
            trigger_id: context.trigger_id,
            view: {
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
                            initial_value: context.text
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
                            initial_user: context.user_id
                        },
                        label: {
                            type: 'plain_text',
                            text: 'Posted by'
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
            }
        }
    },
    confirmation: context => {
        return {
            channel: context.channel_id,
            blocks: [
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
                        text: `*Message*\n${context.message_id}`
                    }
                },
                {
                    type: 'context',
                    elements: [
                        {
                            type: 'mrkdwn',
                            text: `*Posted by* <@${context.selected_user_id}>`
                        },
                        {
                            type: 'mrkdwn',
                            text: `*Importance:* ${context.importance}`
                        },
                        {
                            type: 'mrkdwn',
                            // This should be the link in the ClipIt web app
                            text: `*Link:* http://example.com/${context.user_id}/clip`
                        }
                    ]
                }
            ]
        }
    }
}