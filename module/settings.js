const USER_DB = process.env.db_user || 'root';
const PASS_DB = process.env.db_pass || '1234';
const SELECT_DB = process.env.db_database || 'sdodb2';
const HOST_DB = process.env.db_host || 'localhost';
const PORT_DB = process.env.db_port || 3306;
const options = {
  host: HOST_DB,
  port: PORT_DB,
  user: USER_DB,
  password: PASS_DB,
  database: SELECT_DB,
};


module.exports = {
  token_group: process.env.token_group,
  token_admin: process.env.token_admin,
  group_secret: process.env.group_secret,
  group_id: process.env.group_id || 144267450,
  group_confirm: process.env.group_confirm || 'd01e4ee6',
  db_pass: PASS_DB,
  db_host: HOST_DB,
  db_base: SELECT_DB,
  db_port: PORT_DB,
  db_option: options,
  server_port: process.env.PORT || 8080,
  server_host: process.env.HOST || 'localhost',
};
