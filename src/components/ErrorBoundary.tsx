import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled React error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.removeItem('qs_enterprise_apps');
      localStorage.removeItem('qs_enterprise_apps_v2');
      localStorage.removeItem('qs_auth_user');
      localStorage.removeItem('qs_is_logged_in');
    } catch {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  ระบบพบข้อผิดพลาดในการแสดงผล (Application Error)
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  QISHENG Digital Portal ได้ป้องกันหน้าจอขาวอัตโนมัติ
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
                {this.state.error?.name}: {this.state.error?.message || 'Unknown runtime error'}
              </div>
              {this.state.error?.stack && (
                <pre className="text-[11px] font-mono text-slate-600 dark:text-slate-400 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                </pre>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E60D5] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>รีโหลดหน้าเว็บ (Reload Page)</span>
              </button>
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ล้างแคชและเริ่มใหม่ (Clear Cache & Reset)</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
