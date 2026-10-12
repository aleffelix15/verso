import React, { Component, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackImage: string;
}

interface State {
  hasError: boolean;
}

export class ThreeErrorBoundary extends Component<Props, State> {
  override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("3D Error Boundary caught an error:", error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="relative w-full h-full bg-muted flex items-center justify-center">
          <img
            src={this.props.fallbackImage}
            alt="Produto"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-sm text-muted-foreground shadow-sm">
            <AlertCircle className="w-4 h-4" />
            <span>3D indisponível neste dispositivo</span>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
