'use strict';

const { Pool } = require('pg');
const toSnakeCase = require('../utils/toSnakeCase.js');
const fromSnakeCase = require('../utils/fromSnakeCase');

const OPERATORS = ['>=', '<=', '<>', '>', '<'];

const where = (conditions, firstArgIndex = 1) => {
  conditions = toSnakeCase(conditions);
  const clause = [];
  const args = [];
  let i = firstArgIndex;
  const keys = Object.keys(conditions);
  for (const key of keys) {
    let argNum = ` $${i}`;
    let operator = '=';
    let value = conditions[key];
    if (typeof value === 'string') {
      for (const op of OPERATORS) {
        const len = op.length;
        if (value.startsWith(op)) {
          operator = op;
          value = value.substring(len);
        }
      }
      if (value.includes('*') || value.includes('?')) {
        operator = 'LIKE';
        value = value.replace(/\*/g, '%').replace(/\?/g, '_');
      }
    } else if (Array.isArray(value)) {
      operator = `= ANY($${i}::int[])`;
      argNum = '';
    }
    clause.push(`${key} ${operator}${argNum}`);
    args.push(value);
    i++;
  }
  return { clause: clause.join(' AND '), args };
};

const updates = (delta, firstArgIndex = 1) => {
  delta = toSnakeCase(delta);
  const clause = [];
  const args = [];
  let i = firstArgIndex;
  const keys = Object.keys(delta);
  for (const key of keys) {
    const value = delta[key].toString();
    clause.push(`${key} = $${i++}`);
    args.push(value);
  }
  return { clause: clause.join(', '), args };
};

class Database {
  constructor(config, application) {
    this.pool = new Pool(config);
    this.application = application;
  }

  query(sql, values) {
    const data = values ? values.join(',') : '';
    this.application.logger.log(`${sql}\t[${data}]`);
    return this.pool.query(sql, values);
  }

  insert(table, record) {
    record = toSnakeCase(record);
    const keys = Object.keys(record);
    const nums = new Array(keys.length);
    const data = new Array(keys.length);
    let i = 0;
    for (const key of keys) {
      data[i] = record[key];
      nums[i] = `$${++i}`;
    }
    const fields = keys.join(', ');
    const params = nums.join(', ');
    const sql = `INSERT INTO ${table} (${fields}) VALUES (${params}) RETURNING *`;
    return this.query(sql, data);
  }

  async select(table, fields = ['*'], conditions = null) {
    conditions = toSnakeCase(conditions);
    const keys = fields.join(', ');
    const sql = `SELECT ${keys} FROM ${table}`;
    let whereClause = '';
    let args = [];
    if (conditions) {
      const whereData = where(conditions);
      whereClause = ' WHERE ' + whereData.clause;
      args = whereData.args;
    }
    const res = await this.query(sql + whereClause, args);
    return res.rows.map(row => fromSnakeCase(row));
  }

  delete(table, conditions = null) {
    conditions = toSnakeCase(conditions);
    const { clause, args } = where(conditions);
    const sql = `DELETE FROM ${table} WHERE ${clause}`;
    return this.query(sql, args);
  }

  update(table, delta = null, conditions = null) {
    conditions = toSnakeCase(conditions);
    const upd = updates(delta);
    const cond = where(conditions, upd.args.length + 1);
    const sql = `UPDATE ${table} SET ${upd.clause} WHERE ${cond.clause}`;
    const args = [...upd.args, ...cond.args];
    return this.query(sql, args);
  }

  close() {
    this.pool.end();
  }
}

module.exports = Database;
