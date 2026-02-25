import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { DisplayError } from './shared';
import { Providers } from './shared/providers';

const App: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={DisplayError}>
      <Providers />
    </ErrorBoundary>
  );
};

export default App;
