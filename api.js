const express = require('express');

const {
  create,
  readAll,
  readOne,
  update,
  del,
} = require('./notes');

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.get('/', async (req, res) => {
  const data = await readAll();
  res.json(data);
});

router.post('/', async (req, res) => {
  const {
    title = '',
    text = '',
    datetime = '',
  } = req.body;

  const errors = [];

  if (title.length === 0) {
    errors.push({
      field: 'title',
      error: 'Title must be a string of length 1 to 255 characters',
    });
  }

  if (typeof text !== 'string') {
    errors.push({
      field: 'text',
      error: 'Text must be a string',
    });
  }

  const date = new Date(datetime);
  if (!date.getTime() > 0) {
    errors.push({
      field: 'datetime',
      error: 'Datetime must be ISO 8601 date',
    });
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  const data = await create({ title, text, datetime });
  return res.json(data[0]);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readOne(id);
  if (data.length > 0) {
    res.json(data[0]);
  }
  const errorMessage = { error: 'Note not found' };
  res.status(404).json(errorMessage);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  const {
    title = '',
    text = '',
    datetime = '',
  } = req.body;

  const errors = [];

  if (title.length === 0) {
    errors.push({
      field: 'title',
      error: 'Title must be a string of length 1 to 255 characters',
    });
  }

  if (typeof text !== 'string') {
    errors.push({
      field: 'text',
      error: 'Text must be a string',
    });
  }

  const date = new Date(datetime);
  if (!date.getTime() > 0) {
    errors.push({
      field: 'datetime',
      error: 'Datetime must be ISO 8601 date',
    });
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  const updated = await update(id, { title, text, datetime });
  if (updated.length > 0) {
    return res.json(updated[0]);
  }

  const errorMessage = { error: 'Note not found' };
  return res.status(404).json(errorMessage);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const result = await del(id);
  if (result) {
    return res.status(204).json();
  }

  const errorMessage = { error: 'Note not found' };
  return res.status(404).json(errorMessage);
});

module.exports = router;
