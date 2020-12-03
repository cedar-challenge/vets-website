import React from 'react';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { getEligiblePages } from 'platform/forms-system/src/js/routing';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  createPageList = () => {
    const filteredPageList = getEligiblePages(
      this.props.route.pageList,
      this.props.form.data,
      '/introduction',
    );

    return filteredPageList.pages;
  };

  render() {
    const pageList = this.createPageList();
    return (
      <div className="schemaform-intro">
        <FormTitle title="Register for the cooronavirus vaccine" />
        <p>Equal to VA Form 12345 (coronavirus-vaccine).</p>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the Registration"
        >
          Please complete the 12345 form to apply for coronavirus vaccine
          registration.
        </SaveInProgressIntro>
        <h4>
          Follow the steps below to complete the coronavirus vaccine
          registration.
        </h4>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <h5>Prepare</h5>
              <h6>To fill out this application, you’ll need your:</h6>
              <ul>
                <li>Local VA Medical Center name</li>
              </ul>
              <p>
                <strong>What if I need help filling out my application?</strong>{' '}
                Update This - An accredited representative, like a Veterans
                Service Officer (VSO), can help you fill out your claim.{' '}
                <a href="/disability-benefits/apply/help/index.html">
                  Get help filing your claim
                </a>
              </p>
            </li>
            <li className="process-step list-two">
              <h5>Register</h5>
              <p>Complete this coronavirus vaccine registration form.</p>
              <p>
                After submitting the form, you’ll get a confirmation message.
                You can print this for your records.
              </p>
            </li>
            <li className="process-step list-three">
              <h5>VA Review</h5>
              <p>
                Update This - We process claims within a week. If more than a
                week has passed since you submitted your application and you
                haven’t heard back, please don’t apply again. Call us at.
              </p>
            </li>
            <li className="process-step list-four">
              <h5>Communication</h5>
              <p>
                Let the Veteran know what to expect for communication after form
                is submitted?
              </p>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
          buttonOnly
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Registration"
        />
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={10} ombNumber="54321" expDate="12/31/2030" />
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  form: state?.form,
});
export default connect(mapStateToProps)(IntroductionPage);
