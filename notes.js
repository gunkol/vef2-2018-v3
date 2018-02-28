const { Client } = require('pg');
const xss = require('xss');
const { check, validationResult } = require('express-validator/check');

const connectionString = process.env.DATABASE_URL;

/**
 * Read a single note.
 *
 * @param {number} id - Id of note
 *
 * @returns {Promise} Promise representing the note object or null if not found
 */
async function readOne(id) {
  const client = new Client({ connectionString });
  await client.connect();
  const query = 'SELECT * FROM notes WHERE id = $1';
  const values = [id];
  const result = await client.query(query, values);
  await client.end();

  return result.rows;
}

/**
 * Create a note asynchronously.
 *
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function create({ title, text, datetime } = {}) {
  const client = new Client({ connectionString });
  await client.connect();
  const query = 'INSERT INTO notes(datetime, title, text) VALUES ($1, $2, $3) RETURNING *';
  const values = [xss(datetime), xss(title), xss(text)];
  const result = await client.query(query, values);
  await client.end();

  return result.rows;
}

/**
 * Read all notes.
 *
 * @returns {Promise} Promise representing an array of all note objects
 */
async function readAll() {
  const client = new Client({ connectionString });
  await client.connect();
  const result = await client.query('SELECT * FROM notes');
  await client.end();

  return result.rows;
}

/**
 * Update a note asynchronously.
 *
 * @param {number} id - Id of note to update
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function update(id, { title, text, datetime } = {}) {
  const client = new Client({ connectionString });
  await client.connect();
  const query = 'UPDATE notes SET title = $1, text = $2, datetime = $3 WHERE id = $4 RETURNING *';
  const values = [xss(title), xss(text), xss(datetime), id];
  const result = await client.query(query, values);
  await client.end();

  return result.rows;
}

/**
 * Delete a note asynchronously.
 *
 * @param {number} id - Id of note to delete
 *
 * @returns {Promise} Promise representing the boolean result of creating the note
 */
async function del(id) {
  const client = new Client({ connectionString });
  await client.connect();
  const query = 'DELETE FROM notes WHERE id = $1';
  const values = [id];
  const result = await client.query(query, values);
  await client.end();

  return result.rowCount;
}

module.exports = {
  create,
  readAll,
  readOne,
  update,
  del,
};
