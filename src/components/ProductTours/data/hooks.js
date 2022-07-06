import { useContext, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { ROUTE_NAMES } from '../../EnterpriseApp/constants';
import {
  BROWSE_AND_REQUEST_TOUR_COOKIE_NAME,
  LEARNER_CREDIT_COOKIE_NAME,
} from '../constants';
import { features } from '../../../config';
import { SubsidyRequestsContext } from '../../subsidy-requests';
import { EnterpriseSubsidiesContext } from '../../EnterpriseSubsidiesContext';

const cookies = new Cookies();

export const useBrowseAndRequestTour = () => {
  const { params: { page } } = useRouteMatch();
  const inSettingsPage = page === ROUTE_NAMES.settings;

  const { subsidyRequestConfiguration } = useContext(SubsidyRequestsContext);
  const isBrowseAndRequestEnabledForEnterprise = features.FEATURE_BROWSE_AND_REQUEST;
  const dismissedBrowseAndRequestTourCookie = cookies.get(BROWSE_AND_REQUEST_TOUR_COOKIE_NAME);
  // Only show tour if feature is enabled, the enterprise is eligible for the feature,
  // hide cookie is undefined or false, not in settings page, and subsidy requests are not already enabled
  const showBrowseAndRequestTour = isBrowseAndRequestEnabledForEnterprise
    && !dismissedBrowseAndRequestTourCookie && !inSettingsPage && !subsidyRequestConfiguration?.subsidyRequestsEnabled;

  const [browseAndRequestTourEnabled, setBrowseAndRequestTourEnabled] = useState(showBrowseAndRequestTour);
  return [browseAndRequestTourEnabled, setBrowseAndRequestTourEnabled];
};

export const useLearnerCreditTour = () => {
  const { params: { page } } = useRouteMatch();

  const inLearnerCreditPage = page === ROUTE_NAMES.learnerCredit;
  const { canManageLearnerCredit } = useContext(EnterpriseSubsidiesContext);
  const dismissedLearnerCreditTourCookie = cookies.get(LEARNER_CREDIT_COOKIE_NAME);
  // Only show tour if feature is enabled, the enterprise is eligible for the feature,
  // hide cookie is undefined or false, not in learner credit page
  const showLearnerCreditTour = canManageLearnerCredit
    && !dismissedLearnerCreditTourCookie && !inLearnerCreditPage;

  const [learnerCreditTourEnabled, setBrowseAndRequestTourEnabled] = useState(showLearnerCreditTour);
  return [learnerCreditTourEnabled, setBrowseAndRequestTourEnabled];
};
