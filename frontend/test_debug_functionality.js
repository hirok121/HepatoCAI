// Test file for diagnosis debug functionality
// filepath: d:\Programming\Code_Record\Project\Web_dev\django+reat\HepatoCAI\frontend\test_debug_functionality.js

// This is a simple test script to verify debug functionality
// Run this in browser console when on diagnosis page with debug enabled

function testDebugFunctionality() {
  console.log("🐛 Testing Diagnosis Debug Functionality");
  
  // Check if debug feature is enabled
  const debugEnabled = localStorage.getItem('VITE_ENABLE_DIAGNOSIS_DEBUG') === 'true' ||
                      import.meta.env.VITE_ENABLE_DIAGNOSIS_DEBUG === 'true';
  
  console.log("Debug enabled:", debugEnabled);
  
  if (!debugEnabled) {
    console.warn("Debug functionality is disabled. Enable VITE_ENABLE_DIAGNOSIS_DEBUG=true");
    return;
  }
  
  // Check for debug buttons presence
  const debugButtons = document.querySelectorAll('[data-testid="debug-button"], button[aria-label*="debug"], button[title*="Fill"]');
  console.log(`Found ${debugButtons.length} debug buttons on page`);
  
  // Test random value generators
  const testGenerators = {
    patientName: () => {
      const firstNames = ["John", "Jane", "Michael", "Sarah"];
      const lastNames = ["Smith", "Johnson", "Williams", "Brown"];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${firstName} ${lastName}`;
    },
    age: () => Math.floor(Math.random() * 80) + 18,
    alp: () => Math.floor(Math.random() * (150 - 30) + 30),
    ast: () => Math.floor(Math.random() * (60 - 10) + 10),
  };
  
  // Test generators
  console.log("Testing random value generators:");
  Object.keys(testGenerators).forEach(key => {
    const value = testGenerators[key]();
    console.log(`${key}: ${value}`);
  });
  
  console.log("✅ Debug functionality test completed");
  console.log("💡 Try clicking debug buttons (🐛) next to form fields to test functionality");
}

// Auto-run test if in development environment
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  testDebugFunctionality();
}
