import { validateWhiteSpace } from 'platform/forms/validations';
import { veteranStatusUI } from './status/veteranStatusUI';

import fullSchema from '../0873-schema.json';
import {
  inquiryTypeError,
  inquiryTypeTitle,
  queryError,
  queryTitle,
} from '../../constants/labels';

const { inquiryType, query, veteranStatus } = fullSchema.properties;

const formFields = {
  inquiryType: 'inquiryType',
  query: 'query',
  veteranStatus: 'veteranStatus',
};

const inquiryPage = {
  uiSchema: {
    [formFields.inquiryType]: {
      'ui:title': inquiryTypeTitle,
      'ui:errorMessages': {
        required: inquiryTypeError,
      },
    },
    [formFields.query]: {
      'ui:title': queryTitle,
      'ui:widget': 'textarea',
      'ui:validations': [validateWhiteSpace],
      'ui:errorMessages': {
        required: queryError,
      },
    },
    [formFields.veteranStatus]: {
      ...veteranStatusUI,
    },
  },
  schema: {
    type: 'object',
    required: [formFields.inquiryType, formFields.query],
    properties: {
      [formFields.inquiryType]: inquiryType,
      [formFields.query]: query,
      [formFields.veteranStatus]: veteranStatus,
    },
  },
};

export default inquiryPage;
