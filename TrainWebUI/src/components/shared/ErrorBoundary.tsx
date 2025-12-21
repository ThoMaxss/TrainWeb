'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Optional: Send to error tracking service (Sentry, etc.)
    if (typeof window !== 'undefined' && (window as any).errorTracker) {
      (window as any).errorTracker.captureException(error, { errorInfo });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Đã xảy ra lỗi</h1>
            <p className="text-muted-foreground mb-6">
              Ứng dụng gặp sự cố không mong muốn. Vui lòng thử lại.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-6 p-4 bg-muted rounded-lg text-sm">
                <summary className="cursor-pointer font-medium mb-2">Chi tiết lỗi</summary>
                <pre className="overflow-auto text-xs">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleReset} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Tải lại trang
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Về trang chủ
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
