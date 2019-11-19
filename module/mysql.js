const mysql = require('mysql');
// eslint-disable-next-line no-unused-vars
const dateFormat = require('dateformat');
const settings = require('./settings');

let connection = mysql.createConnection(settings.db_option);
connection.connect();

function handleDisconnect() {
  connection = mysql.createConnection(settings.db_option);
  connection.connect(function(err) {
    if (err) {
      setTimeout(handleDisconnect, 2000);
    }
  });
  connection.on('error', function(err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = {
  optionsDB: settings.db_option,
  connectDB: connection,
  select: function(query, value, cb) {
    connection.query(query, value, function(err, result) {
      if (err) cb({err: err});
      else cb({result: result, err: null});
    });
  },
  insert: function(query, value, cb) {
    connection.query(query, value, function(err, result, fld) {
      if (err) cb({err: err});
      else cb({result: result, err: null});
    });
  },
  update: function(table, value, where, cb) {

  },
  getTableById: function(table, id, cb) {
    connection.query('SELECT * FROM '+table+' where id = ?', [id], function(err, result, fild) {
      if (err) cb({result: 'err'});
      else if (result.length == 0) cb({result: 'null'});
      else cb({result: result[0]});
    });
  },
};
