import React from 'react';
import PropTypes from 'prop-types';

import { API_ROUTES, FIELD_NAMES } from '@@vap-svc/constants';

import ContactInformationField from '../ContactInformationField';

const formSchema = {
  type: 'object',
  properties: {
    emailAddress: {
      type: 'string',
      // This regex was taken from the HCA but modified to allow leading and
      // trailing whitespace to reduce false errors. The `convertDataToPayload`
      // method will clean up the whitespace before submission
      pattern:
        '^(\\s)*(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))(\\s)*$',
    },
  },
  required: ['emailAddress'],
};
const uiSchema = {
  emailAddress: {
    'ui:title': 'Email Address',
    'ui:errorMessages': {
      required: 'Please enter your email address, using this format: X@X.com',
      pattern:
        'Please enter your email address again, using this format: X@X.com',
    },
  },
};

export default class EmailField extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    fieldName: PropTypes.oneOf([FIELD_NAMES.EMAIL]).isRequired,
  };

  convertDataToPayload(value) {
    return { ...value, emailAddress: value.emailAddress.trim() };
  }

  render() {
    return (
      <ContactInformationField
        title={this.props.title}
        fieldName={this.props.fieldName}
        apiRoute={API_ROUTES.EMAILS}
        convertCleanDataToPayload={this.convertDataToPayload}
        formSchema={formSchema}
        uiSchema={uiSchema}
        type="email"
      />
    );
  }
}
