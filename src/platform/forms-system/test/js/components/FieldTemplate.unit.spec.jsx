import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import { render } from '@testing-library/react';

import FieldTemplate from '../../../src/js/components/FieldTemplate';

describe('Schemaform <FieldTemplate>', () => {
  it('should render', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
    };
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const { getByText, queryByText, container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(getByText('Title', { selector: 'label' })).to.not.be.null;
    expect(container.querySelector('.field-child')).not.to.be.null;
    // Errors don't show because the form isn't touched or submitted
    expect(queryByText('Error')).to.be.null;
  });
  it('should render a label if JSX is provided', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': <span>Title</span>,
    };
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const { getByText } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(getByText('Title', { selector: 'label > span' })).to.not.be.null;
  });
  it('should render object', () => {
    const schema = {
      type: 'object',
    };
    const uiSchema = {
      'ui:title': 'Title',
    };
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(tree.props.className).to.equal('field-child');
  });
  it('should render required', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
    };
    const formContext = {
      touched: {},
    };

    const { getByText } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        required
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(getByText('(*Required)')).to.not.be.null;
  });
  it('should render error when touched', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
    };
    const formContext = {
      touched: { test: true },
    };
    const errors = ['Some error'];
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(tree.subTree('.usa-input-error-message').text()).to.equal(
      'Error Some error',
    );
    expect(tree.everySubTree('.usa-input-error')).not.to.be.empty;
  });
  it('should render error when submitted', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
    };
    const formContext = {
      submitted: true,
      touched: {},
    };
    const errors = ['Some error'];
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(tree.subTree('.usa-input-error-message').text()).to.equal(
      'Error Some error',
    );
    expect(tree.everySubTree('.usa-input-error')).not.to.be.empty;
  });
  it('should render description', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
      'ui:description': 'Blah',
    };
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(tree.subTree('p').text()).to.equal('Blah');
  });
  it('should render element description', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
      'ui:description': <div>Blah</div>,
    };
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(tree.text()).to.contain('Blah');
  });
  it('should render description component', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
      'ui:description': () => <someTag>Blah</someTag>,
    };
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(tree.text()).to.contain('uiDescription');
  });
  it('should render fieldset', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
      'ui:widget': 'radio',
    };
    const formContext = {
      touched: {},
    };
    const { getByText } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(getByText('Title', { selector: 'fieldset > legend' })).to.not.be
      .null;
  });
  it('should not render fieldset if showFieldLabel is set to label', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
      'ui:widget': 'radio',
      'ui:options': {
        showFieldLabel: 'label',
      },
    };
    const formContext = {
      touched: {},
    };
    const { getByText, container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(getByText('Title')).to.not.be.null;
    expect(container.querySelector('fieldset')).to.be.null;
  });
  it('should not render a label if no title provided', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {};
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      />,
    );

    expect(tree.subTree('label')).to.be.false;
    expect(tree.everySubTree('.usa-input-error-message')).to.be.empty;
  });
  it('should not render a label if empty or whitespace only title provided', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': '  ',
    };
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(tree.subTree('label')).to.be.false;
    expect(tree.everySubTree('.field-child')).not.to.be.empty;
    expect(tree.everySubTree('.usa-input-error-message')).to.be.empty;
  });
  it('should render required even with a whitespace only title', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': '  ',
    };
    const formContext = {
      touched: {},
    };
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        required
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(tree.subTree('label')).not.to.be.empty;
    expect(tree.everySubTree('.schemaform-required-span')).not.to.be.empty;
  });
});
