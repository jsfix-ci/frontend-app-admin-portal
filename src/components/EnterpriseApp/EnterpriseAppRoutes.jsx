import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import AdminPage from '../../containers/AdminPage';
import CodeManagementPage from '../CodeManagement';
import RequestCodesPage from '../RequestCodesPage';
import SamlProviderConfiguration from '../../containers/SamlProviderConfiguration';
import ReportingConfig from '../ReportingConfig';
import NotFoundPage from '../NotFoundPage';
import LoadingMessage from '../LoadingMessage';
import SettingsPage from '../settings';
import { SubscriptionManagementPage } from '../subscriptions';
import { AnalyticsPage } from '../analytics';
import { removeTrailingSlash } from '../../utils';
import LmsConfigurations from '../../containers/LmsConfigurations';
import { ROUTE_NAMES } from './constants';
import BulkEnrollmentResultsDownloadPage from '../BulkEnrollmentResultsDownloadPage';
import LearnerCreditManagement from '../learner-credit-management';
import { EnterpriseSubsidiesContext } from '../EnterpriseSubsidiesContext';

const EnterpriseAppRoutes = ({
  baseUrl,
  email,
  enterpriseId,
  enterpriseName,
  enableCodeManagementPage,
  enableReportingPage,
  enableSubscriptionManagementPage,
  enableAnalyticsPage,
  enableSamlConfigurationPage,
  enableLmsConfigurationPage,
  enableSettingsPage,
}) => {
  const { canManageLearnerCredit } = useContext(EnterpriseSubsidiesContext);

  return (
    <Switch>
      <Redirect
        exact
        from={baseUrl}
        to={`${removeTrailingSlash(baseUrl)}/admin/learners`}
      />

      <Route
        exact
        path={`${baseUrl}/admin/learners/:actionSlug?`}
        render={routeProps => <AdminPage {...routeProps} />}
      />

      {enableCodeManagementPage && [
        <Route
          key="request-codes"
          exact
          path={`${baseUrl}/admin/coupons/request-codes`}
          render={routeProps => (
            <RequestCodesPage
              {...routeProps}
              emailAddress={email}
              enterpriseName={enterpriseName}
            />
          )}
        />,
        <Route
          key="code-management"
          path={`${baseUrl}/admin/coupons`}
          component={CodeManagementPage}
        />,
      ]}

      {enableReportingPage && (
        <Route
          key="reporting-config"
          exact
          path={`${baseUrl}/admin/reporting`}
          render={routeProps => (enterpriseId
            ? <ReportingConfig {...routeProps} enterpriseId={enterpriseId} />
            : <LoadingMessage className="overview" />
          )}
        />
      )}

      {enableSubscriptionManagementPage && (
        <Route
          key="subscription-management"
          path={`${baseUrl}/admin/${ROUTE_NAMES.subscriptionManagement}`}
          render={routeProps => <SubscriptionManagementPage {...routeProps} />}
        />
      )}

      {enableAnalyticsPage && (
        <Route
          key="analytics"
          exact
          path={`${baseUrl}/admin/analytics`}
          render={routeProps => (
            <AnalyticsPage
              {...routeProps}
            />
          )}
        />
      )}

      {enableSamlConfigurationPage && (
        <Route
          key="saml-configuration"
          exact
          path={`${baseUrl}/admin/samlconfiguration`}
          render={routeProps => (
            <SamlProviderConfiguration
              {...routeProps}
            />
          )}
        />
      )}

      {enableLmsConfigurationPage && (
        <Route
          key="lms-integrations"
          exact
          path={`${baseUrl}/admin/lmsintegrations`}
          render={routeProps => <LmsConfigurations {...routeProps} />}
        />
      )}

      <Route
        exact
        path={`${baseUrl}/admin/bulk-enrollment-results/:bulkEnrollmentJobId`}
        component={BulkEnrollmentResultsDownloadPage}
      />

      {enableSettingsPage && (
        <Route
          path={`${baseUrl}/admin/${ROUTE_NAMES.settings}`}
          component={SettingsPage}
        />
      )}

      {canManageLearnerCredit && (
        <Route
          exact
          path={`${baseUrl}/admin/learner-credit`}
          component={LearnerCreditManagement}
        />
      )}

      <Route path="" component={NotFoundPage} />
    </Switch>
  );
};

EnterpriseAppRoutes.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  enterpriseId: PropTypes.string.isRequired,
  enterpriseName: PropTypes.string.isRequired,
  enableCodeManagementPage: PropTypes.bool.isRequired,
  enableReportingPage: PropTypes.bool.isRequired,
  enableSubscriptionManagementPage: PropTypes.bool.isRequired,
  enableAnalyticsPage: PropTypes.bool.isRequired,
  enableSamlConfigurationPage: PropTypes.bool.isRequired,
  enableLmsConfigurationPage: PropTypes.bool.isRequired,
  enableSettingsPage: PropTypes.bool.isRequired,
};

export default EnterpriseAppRoutes;
