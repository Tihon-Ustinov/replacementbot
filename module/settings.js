const PASSDB = "1234";
const USERDB = "root";
const SELECTDB = "sdodb2";
const HOSTDB = "localhost";
const PORTDB = 3306;
const options = {
    host: HOSTDB,
    port: PORTDB,
    user: USERDB,
    password: PASSDB,
    database: SELECTDB
};


module.exports = {
    GROUP_TOKEN: process.env.GROUP_TOKEN,
    ADMIN_TOKEN: process.env.ADMIN_TOKEN,
    SECRET: "FuckSecret",
    ID_GROUP: 144267450,
    db_pass:PASSDB,
    db_host: HOSTDB,
    db_base: SELECTDB,
    db_port: PORTDB,
    db_option:options

};
