import React from "react";
import ReactDOM from "react-dom/client";
import PropTypes from "prop-types";
import App from "./App.jsx";
import { AuthProvider } from "./hooks/AuthContext.jsx";
import "./index.css";

// Error boundary component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            textAlign: "center",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1>Something went wrong</h1>
          <p>Error: {this.state.error?.message}</p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#c62828",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

// Main app component
export function MainApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

// Initialize the app
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <MainApp />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; color: red;">
      <h1>ERROR: Root element not found!</h1>
      <p>The HTML structure seems corrupted. Please refresh the page.</p>
    </div>
  `;
}
