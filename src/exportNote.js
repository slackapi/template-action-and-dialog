'use strict';

const fs = require('fs');

/*
 *  Create a json file that stored the copied Slack message for each user
 *  Ideally, you should be using a DB. 
 */

const exportToJson = (userId, view) => {
  const fileName = `clip_${userId}.json`;

  fs.open(fileName, 'r', (err, data) => {
    if (err) {
      let obj = {
         messages: []
      };
      obj.messages.push(view);
      fs.writeFile(fileName, JSON.stringify(obj, null, 2), 'utf8', (err) => {
        if (err) throw err;
        console.log(`${fileName} has been created`);
      });
    } else {
      fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) throw err;

        let obj = JSON.parse(data); // Object
        obj.messages.push(view);

        fs.writeFile(fileName, JSON.stringify(obj, null, 2), 'utf8', (err) => {
          if (err) throw err;
          console.log(`New data added to ${fileName}`);
        });
      });
    }

  })
};

module.exports = { exportToJson };
