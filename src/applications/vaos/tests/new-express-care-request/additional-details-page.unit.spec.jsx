import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { waitFor } from '@testing-library/dom';

import { getExpressCareRequestCriteriaMock } from '../mocks/v0';
import { createTestStore, renderWithStoreAndRouter } from '../mocks/setup';
import { mockRequestEligibilityCriteria } from '../mocks/helpers';
import NewExpressCareRequestLayout from '../../containers/NewExpressCareRequestLayout';
import ExpressCareDetailsPage from '../../containers/ExpressCareDetailsPage';
import { fetchExpressCareWindows } from '../../actions/expressCare';

const initialState = {
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
  expressCare: {
    newRequest: {
      data: {
        reason: 'Cough',
      },
      pages: {},
    },
  },
};

describe('VAOS integration: Express Care form - Additional Details Page', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should contain expected form elements', async () => {
    const today = moment();
    const requestCriteria = getExpressCareRequestCriteriaMock('983', [
      {
        day: today
          .clone()
          .tz('America/Denver')
          .format('dddd')
          .toUpperCase(),
        canSchedule: true,
        startTime: today
          .clone()
          .subtract('2', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
        endTime: today
          .clone()
          .add('1', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
      },
    ]);
    mockRequestEligibilityCriteria(['983'], requestCriteria);
    const store = createTestStore({
      ...initialState,
    });
    store.dispatch(fetchExpressCareWindows());

    const history = {
      push: sinon.spy(),
    };
    const screen = renderWithStoreAndRouter(
      <ExpressCareDetailsPage history={history} />,
      {
        store,
      },
    );

    expect(screen.baseElement).to.contain.text(
      'Please provide additional details about your symptoms',
    );
    await waitFor(() =>
      expect(screen.baseElement).to.contain.text('Tell us about your cough'),
    );
    expect(screen.baseElement).to.contain.text(
      'Please provide your phone number and email address where VA health care staff can contact you',
    );
    expect(screen.getByText(/go to your profile/i).href).to.include('/profile');
    screen.getByLabelText(/phone number/i);
    screen.getByLabelText(/email address/i);
    screen.getByText(/submit express care request/i);
  });

  it('should redirect to info page when there is no reason in data', async () => {
    const store = createTestStore({
      ...initialState,
      expressCare: {
        newRequest: {
          data: {},
          pages: {},
        },
      },
    });
    store.dispatch(fetchExpressCareWindows());

    const history = {
      replace: sinon.spy(),
    };
    renderWithStoreAndRouter(
      <NewExpressCareRequestLayout
        history={history}
        location={{ pathname: '/additional-details' }}
      >
        <ExpressCareDetailsPage history={history} />
      </NewExpressCareRequestLayout>,
      {
        store,
      },
    );

    await waitFor(() => expect(history.replace.called).to.be.true);
    expect(history.replace.firstCall.args[0]).to.equal(
      '/new-express-care-request',
    );
  });
});
