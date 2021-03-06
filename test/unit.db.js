'use strict';

const assert = require('assert').strict;

const Database = require('../lib/db.js');
const databaseConfig = require('../config/database.js');

assert(Database);

const applicationStub = { logger: { log: console.log } };

const database = new Database(databaseConfig, applicationStub);

(async () => {
  const empty = 'empty';
  try {
    const user = { login: empty, password: empty, fullName: empty };
    const result = await database.insert('system_users', user);
    assert(result);
    assert.equal(result.rowCount, 1);
  } catch (err) {
    console.log(err.stack);
    process.exit(1);
  }
  try {
    const fields = ['login', 'password'];
    const cond = { login: empty };
    const [record] = await database.select('system_users', fields, cond);
    assert.equal(record.login, empty);
    assert.equal(record.password, empty);
  } catch (err) {
    console.log(err.stack);
    process.exit(1);
  }
  try {
    const delta = { password: empty };
    const cond = { login: empty };
    const result = await database.update('system_users', delta, cond);
    assert.equal(result.rowCount, 1);
  } catch (err) {
    console.log(err.stack);
    process.exit(1);
  }
  try {
    const cond = { login: empty };
    const result = await database.delete('system_users', cond);
    assert.equal(result.rowCount, 1);
  } catch (err) {
    console.log(err.stack);
    process.exit(1);
  }
  database.close();
})();
