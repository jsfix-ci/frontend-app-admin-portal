/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';

export function renderWithRouter(
  ui,
  {
    route = '/',
    history = /* TODO: JSFIX could not patch the breaking change:
    Removed relative pathname support in hash history and memory history 
    Suggested fix: Relative paths are no longer supportet by the hash/memory history, hence we recommend using the entire path name instead. */
    createMemoryHistory({ initialEntries: [route] }),
  } = {},
) {
  // eslint-disable-next-line react/prop-types
  const Wrapper = ({ children }) => (
    <Router history={history}>{children}</Router>
  );
  return {
    ...render(ui, { wrapper: Wrapper }),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
}
