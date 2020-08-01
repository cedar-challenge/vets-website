/* eslint-disable camelcase */

module.exports = {
  type: 'object',
  properties: {
    title: { $ref: 'GenericNestedString' },
    created: { $ref: 'GenericNestedString' },
    changed: { $ref: 'GenericNestedString' },
    promote: { $ref: 'GenericNestedBoolean' },
    sticky: { $ref: 'GenericNestedBoolean' },
    default_langcode: { $ref: 'GenericNestedBoolean' },
    revision_translation_affected: { $ref: 'GenericNestedBoolean' },
    moderation_state: { $ref: 'GenericNestedString' },
    metatag: { $ref: 'RawMetaTags' },
    path: { $ref: 'RawPath' },
    field_administration: {
      type: 'array',
      maxItems: 1,
      items: { $ref: 'EntityReference' },
    },
    field_facility_locator_api_id: { $ref: 'GenericNestedString' },
    field_operating_status_facility: { $ref: 'GenericNestedString' },
    field_operating_status_more_info: { $ref: 'GenericNestedString' },
  },
  required: [
    'title',
    'created',
    'changed',
    'promote',
    'sticky',
    'default_langcode',
    'revision_translation_affected',
    'moderation_state',
    'metatag',
    'path',
    'field_administration',
    'field_facility_locator_api_id',
    'field_operating_status_facility',
    'field_operating_status_more_info',
  ],
};
