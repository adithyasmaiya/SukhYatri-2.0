import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught unhandled React error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-sand-light/40">
          <div className="bg-white rounded-3xl border border-stonewarm p-8 sm:p-10 max-w-md w-full text-center shadow-card space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-ink tracking-tight">
                Something went wrong
              </h2>
              <p className="text-muted text-sm leading-relaxed">
                Please try again.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                onClick={this.handleGoHome}
                className="flex-1 justify-center !rounded-xl"
                leftIcon={<Home className="w-4 h-4" />}
              >
                Go Home
              </Button>
              <Button
                variant="outline"
                onClick={this.handleReset}
                className="flex-1 justify-center !rounded-xl"
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
