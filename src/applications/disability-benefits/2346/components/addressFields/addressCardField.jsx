import {
  getDefaultFormState,
  getDefaultRegistry,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import * as Sentry from '@sentry/browser';
import { errorSchemaIsValid } from 'platform/forms-system/src/js/validation';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import set from 'platform/utilities/data/set';
import PropTypes from 'prop-types';
import React from 'react';
/*
 * For use on a schema of type 'object' or 'array'.
 * Intended to wrap objects or arrays to avoid duplicate functionality here.
 *
 * ui:options available:
 *   viewComponent - ReactNode that should be shown instead of edit fields
 *                   It's passed the same formData the field is
 *   startInEdit   - Either a function or a value that will be evaluated as truthy or not
 *                   If a function is used, it's passed the formData and expects a boolean return value
 *   volatileData  - If this is truthy, the component pattern changes slightly so only completely new
 *                   data can be entered, but not edited.
 *                   This is useful for bank account information.
 *   reviewTitle   - The title shown on the review card. Defaults to ui:title
 *   editTitle     - The title shown on the edit card. Defaults to ui:title
 *   itemName      - The name of the set of data in the card. This shows up on the "New X" button if
 *                   volatileData is set to true.
 */
export default class addressCardField extends React.Component {
  static defaultProps = {
    uiSchema: {},
    errorSchema: {},
    idSchema: {},
    registry: getDefaultRegistry(),
    required: false,
    disabled: false,
    readonly: false,
  };

  constructor(props) {
    super(props);
    // Throw an error if there’s no viewComponent (should be React component)
    if (
      typeof get('ui:options.viewComponent', this.props.uiSchema) !== 'function'
    ) {
      throw new Error(
        `No viewComponent found in uiSchema for addressCardField ${
          this.props.idSchema.$id
        }.`,
      );
    }

    const acceptedTypes = ['object', 'array'];
    if (!acceptedTypes.includes(this.props.schema.type)) {
      throw new Error(
        `Unknown schema type in addressCardField. Expected one of [${acceptedTypes.join(
          ', ',
        )}], but got ${this.props.schema.type}.`,
      );
    }

    const invalidInitialData = !errorSchemaIsValid(props.errorSchema);
    const startInEditConfigOption = get(
      'ui:options.startInEdit',
      this.props.uiSchema,
      false,
    );

    // There are times when the data isn't invalid, but we want to start in edit mode anyhow
    let shouldStartInEdit = startInEditConfigOption;
    if (typeof startInEditConfigOption === 'function') {
      shouldStartInEdit = startInEditConfigOption(this.props.formData);
    }
    const editing = invalidInitialData || shouldStartInEdit;

    this.state = {
      // Set initial state based on whether all the data is valid
      editing,
      canCancel: !editing, // If we start in the edit state, we can't cancel
      oldData: this.props.formData,
      // tempAddressIsSelected: false,
      // permAddressIsSelected: true,
      addressIsSelected: 'permanent-address',
      tempAddressIsAMilitaryBase: false,
      permAddressIsAMilitaryBase: false,
    };
  }

  onPropertyChange(name) {
    return value => {
      const formData = Object.keys(this.props.formData || {}).length
        ? this.props.formData
        : getDefaultFormState(
            this.props.schema,
            undefined,
            this.props.registry.definitions,
          );
      this.props.onChange(set(name, value, formData));
    };
  }

  getTitle = () => {
    const { uiSchema, formData } = this.props;
    return typeof uiSchema['ui:title'] === 'function'
      ? uiSchema['ui:title'](formData)
      : uiSchema['ui:title'];
  };

  getSubtitle = () => {
    const { uiSchema, formData } = this.props;
    return typeof uiSchema['ui:subtitle'] === 'function'
      ? uiSchema['ui:subtitle'](formData)
      : uiSchema['ui:subtitle'];
  };

  getDescription = () => {
    const {
      uiSchema: { 'ui:description': description },
      formData,
    } = this.props;
    if (!description) {
      return null;
    }

    return typeof description === 'function' ? (
      description(formData)
    ) : (
      <p>{description}</p>
    );
  };

  /**
   * Much of this is taken from ArrayField & ObjectField.
   *
   * Renders a SchemaField for each property it wraps.
   */
  getEditView = () => {
    const {
      disabled,
      errorSchema,
      formData,
      idSchema,
      onBlur,
      onChange,
      readonly,
      registry,
      required,
      schema,
    } = this.props;
    const { SchemaField } = registry.fields;
    // We've already used the ui:field and ui:title
    const uiSchema = omit(
      ['ui:field', 'ui:title', 'ui:description'],
      this.props.uiSchema,
    );

    const { editTitle } = this.props.uiSchema['ui:options'];
    const title = editTitle || this.getTitle();
    const subtitle = this.getSubtitle();
    const editingAddressTitle = `Edit ${title.toLowerCase()}`;
    const addTempAddressTitle = `Add a ${title.toLowerCase()}`;

    let tempAddressObj;
    let isTempAddressEmpty;

    if (title === 'Temporary address') {
      tempAddressObj = this.props.formData;
      isTempAddressEmpty = this.isObjectEmpty(tempAddressObj);
    }

    return (
      <div className="review-card">
        <div className="review-card--body input-section va-growable-background">
          {title === 'Permanent address' && (
            <h4 className="review-card--title">{editingAddressTitle}</h4>
          )}
          {isTempAddressEmpty &&
            title === 'Temporary address' && (
              <h4 className="review-card--title">{addTempAddressTitle}</h4>
            )}
          {!isTempAddressEmpty &&
            title === 'Temporary address' && (
              <h4 className="review-card--title">{editingAddressTitle}</h4>
            )}
          {title === 'Permanent address' && (
            <>
              <input
                type="checkbox"
                name="perm-address-military-base"
                id="permAddressMilitaryBase"
                onChange={e => this.handleClick(e)}
                checked={this.state.isPermAddressAMilitaryBase}
              />
              <label htmlFor="permAddressMilitaryBase">
                I live on a United States military base outside of the United
                States
              </label>
            </>
          )}
          {title === 'Temporary address' && (
            <>
              <input
                type="checkbox"
                name="temp-address-military-base"
                id="tempAddressMilitaryBase"
                onChange={e => this.handleClick(e)}
                checked={this.state.isTempAddressAMilitaryBase}
              />
              <label htmlFor="tempAddressMilitaryBase">
                I live on a United States military base outside of the United
                States
              </label>
            </>
          )}

          {subtitle && <div className="review-card--subtitle">{subtitle}</div>}
          <SchemaField
            name={idSchema.$id}
            required={required}
            schema={schema}
            uiSchema={uiSchema}
            errorSchema={errorSchema}
            idSchema={idSchema}
            formData={formData}
            onChange={onChange}
            onBlur={onBlur}
            registry={registry}
            disabled={disabled}
            readonly={readonly}
          />
          <button
            className="usa-button-primary update-button"
            onClick={this.update}
          >
            Save {title.toLowerCase()}
          </button>
          <button
            className="usa-button-secondary cancel-button"
            onClick={this.cancelUpdate}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  getReviewView = () => {
    if (this.props.formContext.onReviewPage) {
      // Check the data type and use the appropriate review field
      const dataType = this.props.schema.type;
      if (dataType === 'object') {
        const { ObjectField } = this.props.registry.fields;
        return <ObjectField {...this.props} />;
      } else if (dataType === 'array') {
        const { ArrayField } = this.props.registry.fields;
        return <ArrayField {...this.props} />;
      }

      // Not having the right type should have been caught in the constructor, but...
      Sentry.withScope(scope => {
        scope.setExtra('message', `Expected object or array, got ${dataType}`);
        Sentry.captureMessage('addressCardField-bad-type-on-review');
      });
      // Fall back to the ViewComponent
    }

    const {
      viewComponent: ViewComponent,
      volatileData,
      reviewTitle,
      itemName,
    } = this.props.uiSchema['ui:options'];
    const title = reviewTitle || this.getTitle();

    let tempAddressObj;
    let isTempAddressEmpty;

    if (title === 'Temporary address') {
      tempAddressObj = this.props.formData;
      isTempAddressEmpty = this.isObjectEmpty(tempAddressObj);
    }

    return (
      <div className="review-card gray-color">
        <div className="review-card--body">
          <h4 className="review-card--title">{title}</h4>
          <ViewComponent formData={this.props.formData} />
          {isTempAddressEmpty &&
            title === 'Permanent address' && (
              <a
                onClick={this.startEditing}
                aria-label="Edit permanent address"
              >
                Edit permanent address
              </a>
            )}
          {isTempAddressEmpty &&
            title === 'Temporary address' && (
              <a
                onClick={this.startEditing}
                aria-label="Add a temporary address"
              >
                Add a temporary address
              </a>
            )}
          {!isTempAddressEmpty && (
            <a onClick={this.startEditing} aria-label={`Edit ${title}`}>
              Edit {title.toLowerCase()}
            </a>
          )}

          {!isTempAddressEmpty &&
            title === 'Permanent address' && (
              <div
                className={
                  !this.state.addressIsSelected === 'permanent-address'
                    ? 'vads-u-background-color--white vads-u-color--link-default button-dimensions vads-u-border-color--primary vads-u-border--2px'
                    : 'vads-u-background-color--primary button-dimensions vads-u-color--white vads-u-border-color--primary vads-u-border--2px'
                }
              >
                <input
                  name="permanent-address"
                  id="permAddress"
                  type="radio"
                  onChange={this.handleClick}
                  checked={this.state.addressIsSelected === 'permanent-address'}
                />
                <label htmlFor="permAddress" className="main">
                  Send to this address
                </label>
              </div>
            )}

          {isTempAddressEmpty &&
            title === 'Permanent address' && (
              <div
                className={
                  !this.state.addressIsSelected === 'permanent-address'
                    ? 'vads-u-background-color--white vads-u-color--link-default button-dimensions vads-u-border-color--primary vads-u-border--2px'
                    : 'vads-u-background-color--primary button-dimensions vads-u-color--white vads-u-border-color--primary vads-u-border--2px'
                }
              >
                <input
                  name="permanent-address"
                  id="permAddress"
                  type="radio"
                  onChange={this.handleClick}
                  checked={this.state.addressIsSelected === 'permanent-address'}
                />
                <label htmlFor="permAddress" className="main">
                  Send to this address123
                </label>
              </div>
            )}

          {!isTempAddressEmpty &&
            title === 'Temporary address' && (
              <div
                className={
                  this.state.addressIsSelected === 'temporary-address'
                    ? 'vads-u-background-color--white vads-u-color--link-default button-dimensions vads-u-border-color--primary vads-u-border--2px'
                    : 'vads-u-background-color--primary button-dimensions vads-u-color--white vads-u-border-color--primary vads-u-border--2px'
                }
              >
                <input
                  name="temporary-address"
                  id="tempAddress"
                  type="radio"
                  onChange={this.handleClick}
                  checked={this.state.addressIsSelected === 'temporary-address'}
                />
                <label htmlFor="tempAddress" className="main">
                  Send to this temp address
                </label>
              </div>
            )}
        </div>

        {volatileData && (
          <button
            className="usa-button-primary edit-button"
            onClick={this.startEditing}
            aria-label={`New ${itemName || title}`}
          >
            New {itemName || title}
          </button>
        )}
      </div>
    );
  };

  isObjectEmpty = obj => Object.keys(obj).length === 0;

  handleClick = e => {
    if (e.target.type === 'radio') {
      // FIXME: state isn't updating for the radio buttons for some reason -@maharielrosario at 3/19/2020, 7:53:09 PM

      this.setState({
        addressIsSelected: e.target.name,
      });
    } else if (e.target.type === 'checkbox') {
      if (this.props.uiSchema['ui:title'] === 'Permanent address') {
        const isPermAddressAMilitaryBase = ({
          permAddressIsAMilitaryBase,
        }) => ({
          permAddressIsAMilitaryBase: !permAddressIsAMilitaryBase,
        });
        this.setState(isPermAddressAMilitaryBase);
      } else if (this.props.uiSchema['ui:title'] === 'Temporary address') {
        const isTempAddressAMilitaryBase = ({
          tempAddressIsAMilitaryBase,
        }) => ({
          tempAddressIsAMilitaryBase: !tempAddressIsAMilitaryBase,
        });
        this.setState(isTempAddressAMilitaryBase);
      }
    }
  };

  startEditing = () => {
    const newState = { editing: true };
    // If the data is volatile, cache the original data before clearing it out so we
    //  have the option to cancel later

    if (this.props.uiSchema['ui:options'].volatileData) {
      newState.oldData = this.props.formData;
      this.resetFormData();
    }

    this.setState(newState);
  };

  cancelUpdate = event => {
    // Don't act like the continue button
    if (event) {
      // Apparently the unit tests don't send this event to the onClick handler
      event.preventDefault();
    }
    this.props.onChange(this.state.oldData);
    this.setState({ editing: false });
  };

  /**
   * Resets the form data to either the oldData passed in or the default data
   * @param {Any} oldData - Optional. The data to replace the current formData with
   */
  resetFormData = oldData => {
    const formData =
      oldData !== undefined
        ? oldData
        : getDefaultFormState(
            this.props.schema,
            undefined,
            this.props.registry.definitions,
          );
    this.props.onChange(formData);
  };

  isRequired = name => {
    const { schema } = this.props;

    const schemaRequired =
      Array.isArray(schema.required) && schema.required.indexOf(name) !== -1;

    if (schemaRequired) {
      return schemaRequired;
    }

    return false;
  };

  update = event => {
    // Don't act like the continue button
    if (event) {
      // Apparently the unit tests don't send this event to the onClick handler
      event.preventDefault();
    }

    if (!errorSchemaIsValid(this.props.errorSchema)) {
      // Show validation errors
      this.props.formContext.onError();
    } else {
      this.setState({ editing: false, canCancel: true });
    }
  };

  render() {
    const description = this.getDescription();
    const viewOrEditCard = this.state.editing
      ? this.getEditView()
      : this.getReviewView();

    return (
      <>
        {/* do conditional rendering for permanent address */}
        {this.props.uiSchema['ui:title'] === 'Permanent address' ? (
          <>
            <h4 className="vads-u-font-weight--bold">Shipping Address</h4>
            <p>
              Your order will ship to this address. Orders typically arrive
              within 7-10 business days.
            </p>
            <p className="vads-u-font-weight--bold">
              Select the address you would like your order sent to:
              <span className="schemaform-required-span vads-u-font-weight--normal">
                (*Required)
              </span>
            </p>
          </>
        ) : null}
        {description}
        {viewOrEditCard}
      </>
    );
  }
}

addressCardField.propTypes = {
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      viewComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
        .isRequired,
    }).isRequired,
    'ui:description': PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    'ui:subtitle': PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  }).isRequired,
  schema: PropTypes.object.isRequired,
  errorSchema: PropTypes.object.isRequired,
  idSchema: PropTypes.object.isRequired,
  registry: PropTypes.shape({
    fields: PropTypes.shape({
      SchemaField: PropTypes.func.isRequired,
    }),
    definitions: PropTypes.object.isRequired,
  }).isRequired,
  formData: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  formContext: PropTypes.shape({
    onError: PropTypes.func.isRequired,
  }).isRequired,
};
