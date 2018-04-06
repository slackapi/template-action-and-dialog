'use strict';

const fs = require('fs');

/*
 *  Send confirmation creation confirmation via
 *  chat.postMessage to the user who created it
 */

const exportToJson = (submission) => {
  const fileName = 'clip.json';

  fs.open(fileName, 'r', (err, data) => {
    if (err) {
      let obj = {
         messages: []
      };
      obj.messages.push(submission);
      fs.writeFile(fileName, JSON.stringify(obj, null, 2), 'utf8', (err) => {
        if (err) throw err;
        console.log(`${fileName} has been created`);
      });
    } else {
      fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) throw err;

        let obj = JSON.parse(data); // Object
        obj.messages.push(submission);

        fs.writeFile(fileName, JSON.stringify(obj, null, 2), 'utf8', (err) => {
          if (err) throw err;
          console.log(`New data added to ${fileName}`);
        });
      });
    }

  })
};

module.exports = { exportToJson };
