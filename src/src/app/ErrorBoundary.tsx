import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { trackException } from './application-insights';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    trackException(error);
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong. Please reload the page.</p>;
    }

    return this.props.children;
  }
}
