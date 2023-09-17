const sqliteConnection = require("../../sqlite");

const createUsers = require("./createUsers")

async function migrationsRun() {
  sqliteConnection()
    .then(db => db.exec(createUsers))
    .catch(error => console.error(error));
}

module.exports = migrationsRun;