import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Simple loading component
function LoadingSpinner() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3498db",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <p style={{ marginTop: "20px" }}>Loading HepatoC AI...</p>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

// Error boundary component
class ErrorBoundary extends React.Component {
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

// Lazy load the main app components
const App = React.lazy(() => import("./App.jsx"));
const AuthProvider = React.lazy(() =>
  import("./AuthContext.jsx").then((module) => ({
    default: module.AuthProvider,
  }))
);

// Main app component with loading
function MainApp() {
  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.Suspense>
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
