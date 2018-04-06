# Message actions and dialogs blueprint
​
By registering your app's capabilities as message actions, users can pick and choose messages to send to your app so you can do something useful with them. Store these messages in a virtual trapper keeper, feed them to your internal markov chain bot, or file away information about an important lead.

## Creating a hypothetical "ClipIt" app using an action and a dialog

This Slack app allows users to "clip" a message posted on Slack by using the actions to export the message to the 3rd party app/service, let's say ClipIt! web app.

### User Flow

When a user hover a message then choose "Clip the message" from the action menu, a dialog pops open.
The message text is pre-populated into the dialog box, but the user can edit before submitting it too.
Once a user finalize the form and submit the form, the app DMs the user with the confirmation.
​
![ClipIt](https://github.com/slackapi/template-action-and-dialog/blob/master/images/screen.gif?raw=true)
​
## Setup
​
#### Create a Slack app
​
1. Create an app at https://api.slack.com/apps?new_app_token=1
2. Navigate to the OAuth & Permissions page and add the following scopes:
    * `commands`
    * `users:read`
3. Click 'Save Changes' and install the app
​
#### Run locally or [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/slack-action-and-dialogs-blueprint)

1. Get the code
    * Either clone this repo and run `npm install`
    * Or visit https://glitch.com/edit/#!/remix/slack-action-and-dialogs-blueprint
2. Set the following environment variables to `.env` with your API credentials (see `.env.sample`):
    * `SLACK_CLIENT_ID`: client ID (available at **Basic Information**)
    * `SLACK_CLIENT_SECRET`: client secret (available at **Basic Information**)
    * `SLACK_VERIFICATION_TOKEN`: Your app's Verification Token (available at **Basic Information**)
    * `SLACK_ACCESS_TOKEN`: Your app's `xoxa-` workspace token (available once you install your app to a workspace)  
3. If you're running the app locally:
    1. Start the app (`npm start`)
    1. In another window, start ngrok on the same port as your webserver
​
#### Add a Action
1. Go back to the app settings and click on **Interactive Components**.
2. Click "Enable Interactive Components" button:
    * Request URL: Your ngrok or Glitch URL + `/actions` in the end (e.g. `https://example.ngrok.io/actions`)
    * Under **Actions**, click "Create New Action" button
      * Action Name: `Clip the message`
      * Description: `Save this message to ClipIt! app`
      * Callback ID: `clipit`
3. Save and reinstall the app
​

​
