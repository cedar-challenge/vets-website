// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'paragraph',
  entityBundle: 'media_list_images',
});

module.exports = {
  filter: [''],
  transform,
};
