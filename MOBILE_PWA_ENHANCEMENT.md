# Mobile Responsiveness and PWA Enhancement

## 1. Progressive Web App Implementation

### Service Worker Configuration

**Create `frontend/public/sw.js`:**

```javascript
const CACHE_NAME = "hepatocai-v1.0.0";
const urlsToCache = [
  "/",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/manifest.json",
  "/offline.html",
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      if (response) {
        return response;
      }

      return fetch(event.request).catch(() => {
        // If both cache and network fail, show offline page
        if (event.request.destination === "document") {
          return caches.match("/offline.html");
        }
      });
    })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline form submissions
  const offlineData = await getOfflineData();
  for (const data of offlineData) {
    try {
      await fetch(data.url, {
        method: data.method,
        headers: data.headers,
        body: data.body,
      });
      // Remove from offline storage on success
      await removeOfflineData(data.id);
    } catch (error) {
      console.log("Sync failed for:", data.url);
    }
  }
}
```

**Create `frontend/public/manifest.json`:**

```json
{
  "name": "HepatoCAI - AI Hepatitis Diagnosis",
  "short_name": "HepatoCAI",
  "description": "AI-powered Hepatitis C diagnosis and analysis platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1976d2",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Quick Diagnosis",
      "short_name": "Diagnose",
      "description": "Start a new diagnosis quickly",
      "url": "/diagnosis",
      "icons": [
        {
          "src": "/icons/shortcut-diagnosis.png",
          "sizes": "192x192"
        }
      ]
    },
    {
      "name": "AI Assistant",
      "short_name": "AI Help",
      "description": "Get AI-powered medical insights",
      "url": "/ai-assistant",
      "icons": [
        {
          "src": "/icons/shortcut-ai.png",
          "sizes": "192x192"
        }
      ]
    }
  ],
  "categories": ["medical", "health", "productivity"],
  "lang": "en",
  "dir": "ltr"
}
```

### PWA Service Integration

**Create `frontend/src/services/pwaService.js`:**

```javascript
class PWAService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.handleOnline();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.handleOffline();
    });

    // Listen for app install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });
  }

  async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("SW registered: ", registration);

        // Listen for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              this.showUpdateAvailable();
            }
          });
        });
      } catch (error) {
        console.log("SW registration failed: ", error);
      }
    }
  }

  async installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      this.deferredPrompt = null;
      this.hideInstallButton();
    }
  }

  showInstallButton() {
    // Show install button in UI
    const event = new CustomEvent("pwa-install-available");
    window.dispatchEvent(event);
  }

  hideInstallButton() {
    const event = new CustomEvent("pwa-install-completed");
    window.dispatchEvent(event);
  }

  showUpdateAvailable() {
    const event = new CustomEvent("pwa-update-available");
    window.dispatchEvent(event);
  }

  handleOnline() {
    console.log("App is online");
    // Sync offline data
    if (
      "serviceWorker" in navigator &&
      "sync" in window.ServiceWorkerRegistration.prototype
    ) {
      navigator.serviceWorker.ready.then((registration) => {
        return registration.sync.register("background-sync");
      });
    }

    // Show online indicator
    const event = new CustomEvent("network-status-change", {
      detail: { online: true },
    });
    window.dispatchEvent(event);
  }

  handleOffline() {
    console.log("App is offline");
    // Show offline indicator
    const event = new CustomEvent("network-status-change", {
      detail: { online: false },
    });
    window.dispatchEvent(event);
  }

  // Offline data management
  async saveOfflineData(data) {
    const offlineData = JSON.parse(localStorage.getItem("offlineData") || "[]");
    offlineData.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...data,
    });
    localStorage.setItem("offlineData", JSON.stringify(offlineData));
  }

  getOfflineData() {
    return JSON.parse(localStorage.getItem("offlineData") || "[]");
  }

  removeOfflineData(id) {
    const offlineData = this.getOfflineData().filter((item) => item.id !== id);
    localStorage.setItem("offlineData", JSON.stringify(offlineData));
  }

  // Check if app is running as PWA
  isPWA() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone ||
      document.referrer.includes("android-app://")
    );
  }

  // Get device info for responsive design
  getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    return {
      isMobile,
      isTablet,
      isDesktop,
      isPWA: this.isPWA(),
      platform: this.getPlatform(),
      screenSize: {
        width: window.screen.width,
        height: window.screen.height,
      },
    };
  }

  getPlatform() {
    const userAgent = navigator.userAgent;
    if (/Android/i.test(userAgent)) return "Android";
    if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
    if (/Windows/i.test(userAgent)) return "Windows";
    if (/Mac/i.test(userAgent)) return "macOS";
    if (/Linux/i.test(userAgent)) return "Linux";
    return "Unknown";
  }
}

export default new PWAService();
```

## 2. Mobile-Optimized Components

### Responsive Navigation

**Create `frontend/src/components/mobile/MobileNavigation.jsx`:**

```jsx
import React, { useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Badge,
  Box,
} from "@mui/material";
import {
  Home,
  LocalHospital,
  Psychology,
  Person,
  Menu,
  Notifications,
  Settings,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";

function MobileNavigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthorized } = useAuth();

  const bottomNavItems = [
    { label: "Home", icon: <Home />, path: "/" },
    { label: "Diagnosis", icon: <LocalHospital />, path: "/diagnosis" },
    { label: "AI Assistant", icon: <Psychology />, path: "/ai-assistant" },
    { label: "Profile", icon: <Person />, path: "/profile" },
  ];

  const drawerItems = [
    { label: "Dashboard", icon: <Home />, path: "/dashboard" },
    {
      label: "Patient Education",
      icon: <LocalHospital />,
      path: "/patient-education",
    },
    { label: "Research", icon: <Psychology />, path: "/research" },
    { label: "Community", icon: <Person />, path: "/community" },
    { label: "Settings", icon: <Settings />, path: "/settings" },
  ];

  const handleBottomNavChange = (event, newValue) => {
    setBottomNavValue(newValue);
    navigate(bottomNavItems[newValue].path);
  };

  const handleDrawerItemClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile App Bar */}
      <AppBar
        position="fixed"
        sx={{
          display: { xs: "block", md: "none" },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            HepatoCAI
          </Typography>

          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Box sx={{ width: 250, pt: 8 }} role="presentation">
          <List>
            {drawerItems.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleDrawerItemClick(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Bottom Navigation */}
      <BottomNavigation
        value={bottomNavValue}
        onChange={handleBottomNavChange}
        showLabels
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: "flex", md: "none" },
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        {bottomNavItems.map((item, index) => (
          <BottomNavigationAction
            key={index}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </>
  );
}

export default MobileNavigation;
```

### Touch-Optimized Diagnosis Form

**Create `frontend/src/components/mobile/MobileDiagnosisForm.jsx`:**

```jsx
import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Card,
  CardContent,
  Slider,
  Switch,
  FormControlLabel,
  TextField,
  Chip,
  Stack,
  Alert,
  LinearProgress,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import {
  NavigateNext,
  NavigateBefore,
  Save,
  Help,
  Camera,
  Mic,
  Upload,
} from "@mui/icons-material";
import { useSwipeable } from "react-swipeable";

function MobileDiagnosisForm({ onSubmit, onSave }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {},
    symptoms: {},
    riskFactors: {},
    labResults: {},
  });
  const [touchStart, setTouchStart] = useState(null);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const steps = [
    "Personal Information",
    "Current Symptoms",
    "Risk Factors",
    "Lab Results",
    "Review & Submit",
  ];

  // Swipe handlers for step navigation
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handleBack(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleFieldChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const speedDialActions = [
    {
      icon: <Camera />,
      name: "Take Photo",
      action: () => console.log("Camera"),
    },
    { icon: <Mic />, name: "Voice Input", action: () => console.log("Voice") },
    {
      icon: <Upload />,
      name: "Upload File",
      action: () => console.log("Upload"),
    },
    { icon: <Help />, name: "Get Help", action: () => console.log("Help") },
  ];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={formData.personalInfo.age || ""}
                  onChange={(e) =>
                    handleFieldChange("personalInfo", "age", e.target.value)
                  }
                  InputProps={{
                    sx: { fontSize: "18px" }, // Larger text for mobile
                  }}
                />

                <Box>
                  <Typography gutterBottom>Weight (kg)</Typography>
                  <Slider
                    value={formData.personalInfo.weight || 70}
                    onChange={(e, value) =>
                      handleFieldChange("personalInfo", "weight", value)
                    }
                    min={30}
                    max={200}
                    marks={[
                      { value: 50, label: "50kg" },
                      { value: 100, label: "100kg" },
                      { value: 150, label: "150kg" },
                    ]}
                    valueLabelDisplay="on"
                    sx={{ mt: 2 }}
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.personalInfo.gender === "female"}
                      onChange={(e) =>
                        handleFieldChange(
                          "personalInfo",
                          "gender",
                          e.target.checked ? "female" : "male"
                        )
                      }
                    />
                  }
                  label="Female"
                />
              </Stack>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Symptoms
              </Typography>
              <Stack spacing={2}>
                {[
                  "Fatigue",
                  "Abdominal Pain",
                  "Nausea",
                  "Joint Pain",
                  "Skin Yellowing",
                  "Dark Urine",
                ].map((symptom) => (
                  <FormControlLabel
                    key={symptom}
                    control={
                      <Switch
                        checked={formData.symptoms[symptom] || false}
                        onChange={(e) =>
                          handleFieldChange(
                            "symptoms",
                            symptom,
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={symptom}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "16px",
                      },
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Factors
              </Typography>
              <Stack spacing={2}>
                {[
                  "Blood Transfusion",
                  "IV Drug Use",
                  "Unprotected Sex",
                  "Healthcare Exposure",
                  "Tattoos/Piercings",
                ].map((factor) => (
                  <Chip
                    key={factor}
                    label={factor}
                    clickable
                    color={formData.riskFactors[factor] ? "primary" : "default"}
                    onClick={() =>
                      handleFieldChange(
                        "riskFactors",
                        factor,
                        !formData.riskFactors[factor]
                      )
                    }
                    sx={{
                      fontSize: "14px",
                      height: "40px",
                      "& .MuiChip-label": {
                        px: 2,
                      },
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lab Results (Optional)
              </Typography>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="ALT Level"
                  type="number"
                  value={formData.labResults.alt || ""}
                  onChange={(e) =>
                    handleFieldChange("labResults", "alt", e.target.value)
                  }
                  helperText="Normal range: 10-40 U/L"
                />

                <TextField
                  fullWidth
                  label="AST Level"
                  type="number"
                  value={formData.labResults.ast || ""}
                  onChange={(e) =>
                    handleFieldChange("labResults", "ast", e.target.value)
                  }
                  helperText="Normal range: 10-40 U/L"
                />

                <Alert severity="info">
                  Lab results are optional but help improve diagnosis accuracy
                </Alert>
              </Stack>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Review Your Information
              </Typography>
              <Stack spacing={2}>
                <Typography variant="subtitle2">Personal Info:</Typography>
                <Typography variant="body2">
                  Age: {formData.personalInfo.age}, Weight:{" "}
                  {formData.personalInfo.weight}kg
                </Typography>

                <Typography variant="subtitle2">Symptoms:</Typography>
                <Box>
                  {Object.entries(formData.symptoms)
                    .filter(([key, value]) => value)
                    .map(([symptom]) => (
                      <Chip
                        key={symptom}
                        label={symptom}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                </Box>

                <Alert severity="warning">
                  Please review all information before submitting
                </Alert>
              </Stack>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ pb: 10, pt: 2 }} {...swipeHandlers}>
      {/* Progress Indicator */}
      <Box sx={{ mb: 3 }}>
        <LinearProgress
          variant="determinate"
          value={(activeStep / (steps.length - 1)) * 100}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mt: 1, textAlign: "center" }}
        >
          Step {activeStep + 1} of {steps.length}
        </Typography>
      </Box>

      {/* Step Content */}
      <Box sx={{ mb: 3 }}>{renderStepContent(activeStep)}</Box>

      {/* Navigation Buttons */}
      <Box
        sx={{
          position: "fixed",
          bottom: 70,
          left: 16,
          right: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<NavigateBefore />}
          size="large"
        >
          Back
        </Button>

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={() => onSubmit(formData)}
            endIcon={<Save />}
            size="large"
          >
            Submit
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<NavigateNext />}
            size="large"
          >
            Next
          </Button>
        )}
      </Box>

      {/* Speed Dial for Additional Actions */}
      <SpeedDial
        ariaLabel="Additional actions"
        sx={{ position: "fixed", bottom: 140, right: 16 }}
        icon={<SpeedDialIcon />}
        open={speedDialOpen}
        onOpen={() => setSpeedDialOpen(true)}
        onClose={() => setSpeedDialOpen(false)}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}

export default MobileDiagnosisForm;
```

## 3. Offline Functionality

### Offline Storage Service

**Create `frontend/src/services/offlineService.js`:**

```javascript
class OfflineService {
  constructor() {
    this.dbName = "HepatoCAI-Offline";
    this.dbVersion = 1;
    this.db = null;
    this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains("diagnoses")) {
          const diagnosisStore = db.createObjectStore("diagnoses", {
            keyPath: "id",
            autoIncrement: true,
          });
          diagnosisStore.createIndex("timestamp", "timestamp", {
            unique: false,
          });
          diagnosisStore.createIndex("synced", "synced", { unique: false });
        }

        if (!db.objectStoreNames.contains("userdata")) {
          const userStore = db.createObjectStore("userdata", {
            keyPath: "key",
          });
        }

        if (!db.objectStoreNames.contains("media")) {
          const mediaStore = db.createObjectStore("media", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };
    });
  }

  async saveDiagnosis(diagnosisData) {
    if (!this.db) await this.initDB();

    const transaction = this.db.transaction(["diagnoses"], "readwrite");
    const store = transaction.objectStore("diagnoses");

    const data = {
      ...diagnosisData,
      timestamp: new Date().toISOString(),
      synced: false,
    };

    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUnsynced() {
    if (!this.db) await this.initDB();

    const transaction = this.db.transaction(["diagnoses"], "readonly");
    const store = transaction.objectStore("diagnoses");
    const index = store.index("synced");

    return new Promise((resolve, reject) => {
      const request = index.getAll(false);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async markSynced(id) {
    if (!this.db) await this.initDB();

    const transaction = this.db.transaction(["diagnoses"], "readwrite");
    const store = transaction.objectStore("diagnoses");

    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          data.synced = true;
          const putRequest = store.put(data);
          putRequest.onsuccess = () => resolve(putRequest.result);
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error("Record not found"));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async saveUserData(key, data) {
    if (!this.db) await this.initDB();

    const transaction = this.db.transaction(["userdata"], "readwrite");
    const store = transaction.objectStore("userdata");

    return new Promise((resolve, reject) => {
      const request = store.put({ key, data, timestamp: Date.now() });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserData(key) {
    if (!this.db) await this.initDB();

    const transaction = this.db.transaction(["userdata"], "readonly");
    const store = transaction.objectStore("userdata");

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveMedia(file, metadata = {}) {
    if (!this.db) await this.initDB();

    const transaction = this.db.transaction(["media"], "readwrite");
    const store = transaction.objectStore("media");

    // Convert file to blob for storage
    const fileData = await this.fileToArrayBuffer(file);

    const data = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      data: fileData,
      metadata,
      timestamp: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async fileToArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  async getStorageUsage() {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage,
        available: estimate.quota,
        percentage: (estimate.usage / estimate.quota) * 100,
      };
    }
    return null;
  }

  async clearOfflineData() {
    if (!this.db) await this.initDB();

    const stores = ["diagnoses", "userdata", "media"];
    const transaction = this.db.transaction(stores, "readwrite");

    const promises = stores.map((storeName) => {
      const store = transaction.objectStore(storeName);
      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    return Promise.all(promises);
  }
}

export default new OfflineService();
```

## 4. Touch Gestures and Interactions

### Gesture Service

**Create `frontend/src/services/gestureService.js`:**

```javascript
class GestureService {
  constructor() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 100;
    this.maxSwipeTime = 300;
    this.startTime = 0;
  }

  handleTouchStart(event, callback) {
    this.touchStartX = event.changedTouches[0].screenX;
    this.touchStartY = event.changedTouches[0].screenY;
    this.startTime = Date.now();

    if (callback) callback("touchstart", event);
  }

  handleTouchEnd(event, callbacks = {}) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.touchEndY = event.changedTouches[0].screenY;
    const endTime = Date.now();
    const duration = endTime - this.startTime;

    if (duration > this.maxSwipeTime) return;

    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine gesture type
    if (absDeltaX > this.minSwipeDistance && absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > 0) {
        if (callbacks.onSwipeRight) callbacks.onSwipeRight(event);
      } else {
        if (callbacks.onSwipeLeft) callbacks.onSwipeLeft(event);
      }
    } else if (absDeltaY > this.minSwipeDistance && absDeltaY > absDeltaX) {
      // Vertical swipe
      if (deltaY > 0) {
        if (callbacks.onSwipeDown) callbacks.onSwipeDown(event);
      } else {
        if (callbacks.onSwipeUp) callbacks.onSwipeUp(event);
      }
    } else if (absDeltaX < 10 && absDeltaY < 10) {
      // Tap
      if (callbacks.onTap) callbacks.onTap(event);
    }

    if (callbacks.onTouchEnd) callbacks.onTouchEnd(event);
  }

  // Long press detection
  handleLongPress(element, callback, duration = 500) {
    let timer;
    let startPos = { x: 0, y: 0 };

    const start = (e) => {
      const touch = e.touches ? e.touches[0] : e;
      startPos = { x: touch.clientX, y: touch.clientY };

      timer = setTimeout(() => {
        callback(e);
      }, duration);
    };

    const end = () => {
      clearTimeout(timer);
    };

    const move = (e) => {
      const touch = e.touches ? e.touches[0] : e;
      const deltaX = Math.abs(touch.clientX - startPos.x);
      const deltaY = Math.abs(touch.clientY - startPos.y);

      // Cancel if moved too much
      if (deltaX > 10 || deltaY > 10) {
        clearTimeout(timer);
      }
    };

    element.addEventListener("touchstart", start);
    element.addEventListener("mousedown", start);
    element.addEventListener("touchend", end);
    element.addEventListener("mouseup", end);
    element.addEventListener("touchmove", move);
    element.addEventListener("mousemove", move);

    // Return cleanup function
    return () => {
      element.removeEventListener("touchstart", start);
      element.removeEventListener("mousedown", start);
      element.removeEventListener("touchend", end);
      element.removeEventListener("mouseup", end);
      element.removeEventListener("touchmove", move);
      element.removeEventListener("mousemove", move);
      clearTimeout(timer);
    };
  }

  // Pinch zoom detection
  handlePinchZoom(element, callbacks = {}) {
    let lastTouchDistance = 0;
    let isZooming = false;

    const getTouchDistance = (touches) => {
      if (touches.length < 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        isZooming = true;
        lastTouchDistance = getTouchDistance(e.touches);
        if (callbacks.onZoomStart) callbacks.onZoomStart(e);
      }
    };

    const handleTouchMove = (e) => {
      if (isZooming && e.touches.length === 2) {
        const currentDistance = getTouchDistance(e.touches);
        const scale = currentDistance / lastTouchDistance;

        if (callbacks.onZoom) callbacks.onZoom(e, scale);
        lastTouchDistance = currentDistance;
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        isZooming = false;
        if (callbacks.onZoomEnd) callbacks.onZoomEnd(e);
      }
    };

    element.addEventListener("touchstart", handleTouchStart);
    element.addEventListener("touchmove", handleTouchMove);
    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }
}

export default new GestureService();
```

This mobile enhancement provides comprehensive PWA capabilities, touch-optimized interfaces, offline functionality, and gesture support for a native-like mobile experience.
