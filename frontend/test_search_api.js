// Test script to verify search API functionality
// Run this in browser console to test the search API

const testSearchAPI = async () => {
  try {
    // Get auth token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No auth token found. Please login first.');
      return;
    }

    // Test search API with basic filters
    const response = await fetch('http://localhost:8000/api/diagnosis/search/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Search API Response:', data);
    
    if (data.data && data.data.results) {
      console.log(`Found ${data.data.results.length} diagnosis records`);
      console.log('First record:', data.data.results[0]);
    }

    return data;
  } catch (error) {
    console.error('Error testing search API:', error);
  }
};

// Test with patient name filter
const testSearchWithName = async (patientName) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:8000/api/diagnosis/search/?patient_name=${encodeURIComponent(patientName)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log(`Search results for "${patientName}":`, data);
    return data;
  } catch (error) {
    console.error('Error testing search API with name:', error);
  }
};

// Run tests
console.log('Testing search API...');
testSearchAPI().then(() => {
  console.log('Testing search with patient name "William"...');
  testSearchWithName('William');
});
