import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import { Router, Route } from 'react-router-dom';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import EnterpriseAppSkeleton from '../EnterpriseApp/EnterpriseAppSkeleton';
import { ToastsContext } from '../Toasts';
import UserActivationPage from './index';

const TEST_ENTERPRISE_SLUG = 'test-enterprise';

const initialHistory = /* TODO: JSFIX could not patch the breaking change:
Removed relative pathname support in hash history and memory history 
Suggested fix: Relative paths are no longer supportet by the hash/memory history, hence we recommend using the entire path name instead. */
createMemoryHistory({
  initialEntries: [`/${TEST_ENTERPRISE_SLUG}/admin/register/activate`],
});

const UserActivationPageWrapper = ({
  history,
  ...rest
}) => (
  <Router history={history}>
    <ToastsContext.Provider value={{ addToast: () => {} }}>
      <Route
        exact
        path="/:enterpriseSlug/admin/register/activate"
        render={routeProps => <UserActivationPage {...routeProps} {...rest} />}
      />
    </ToastsContext.Provider>
  </Router>
);

UserActivationPageWrapper.defaultProps = {
  history: initialHistory,
};

UserActivationPageWrapper.propTypes = {
  history: PropTypes.shape(),
};

describe('<UserActivationPage />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders loading message when not authenticated (redirect to enterprise proxy login)', () => {
    getAuthenticatedUser.mockReturnValue(null);
    // Note: this test does not assert that the redirect to the proxy login works since
    // JSdom does not implement global.location. Due to this, JSdom outputs a "Not
    // implemented: navigation" warning for this test that can safely be ignored.
    const wrapper = mount(<UserActivationPageWrapper />);

    // verify that the loading skeleton appears during redirect
    expect(wrapper.contains(EnterpriseAppSkeleton)).toBeTruthy();
  });

  it('redirects to /admin/register when user is authenticated but has no JWT roles', () => {
    getAuthenticatedUser.mockReturnValue({
      username: 'edx',
      roles: [],
    });
    const history = /* TODO: JSFIX could not patch the breaking change:
    Removed relative pathname support in hash history and memory history 
    Suggested fix: Relative paths are no longer supportet by the hash/memory history, hence we recommend using the entire path name instead. */
    createMemoryHistory({
      initialEntries: [`/${TEST_ENTERPRISE_SLUG}/admin/register/activate`],
    });

    mount(<UserActivationPageWrapper history={history} />);
    const expectedRedirectRoute = `/${TEST_ENTERPRISE_SLUG}/admin/register`;
    expect(history.location.pathname).toEqual(expectedRedirectRoute);
  });

  it('displays loading skeleton when user is authenticated, has "enterprise_admin" JWT role, and is pending user hydration', () => {
    getAuthenticatedUser.mockReturnValue({
      username: 'edx',
      roles: ['enterprise_admin:*'],
    });

    const wrapper = mount(<UserActivationPageWrapper />);
    expect(wrapper.find(EnterpriseAppSkeleton).exists()).toBeTruthy();
  });

  it('displays an alert when user with unverified email is authenticated and has "enterprise_admin" JWT role', () => {
    getAuthenticatedUser.mockReturnValue({
      username: 'edx',
      roles: ['enterprise_admin:*'],
      isActive: false,
    });

    const wrapper = mount(<UserActivationPageWrapper />);
    expect(wrapper.find('Alert').exists()).toBeTruthy();
  });

  it('redirects to /admin/learners route when user with verified email is authenticated and has "enterprise_admin" JWT role', () => {
    getAuthenticatedUser.mockReturnValue({
      username: 'edx',
      roles: ['enterprise_admin:*'],
      isActive: true,
    });

    const history = /* TODO: JSFIX could not patch the breaking change:
    Removed relative pathname support in hash history and memory history 
    Suggested fix: Relative paths are no longer supportet by the hash/memory history, hence we recommend using the entire path name instead. */
    createMemoryHistory({
      initialEntries: [`/${TEST_ENTERPRISE_SLUG}/admin/register/activate`],
    });

    mount(<UserActivationPageWrapper history={history} />);
    const expectedRedirectRoute = `/${TEST_ENTERPRISE_SLUG}/admin/learners`;
    expect(history.location.pathname).toEqual(expectedRedirectRoute);
  });
});
