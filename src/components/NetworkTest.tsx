import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const NetworkTest = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDirectFetch = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log('Testing direct fetch to API...');
      
      const response = await fetch('https://your-new-api-domain.com/api/v1/product', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      setTestResult({
        success: true,
        message: `API is reachable! Status: ${response.status}`,
        data: data,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Direct fetch failed:', err);
      setTestResult({
        success: false,
        message: err.message || 'Network request failed',
        error: err,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testCors = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log('Testing CORS...');
      
      const response = await fetch('https://your-new-api-domain.com/api/v1/product', {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type, Accept',
        },
      });

      console.log('CORS response status:', response.status);
      console.log('CORS response headers:', response.headers);

      setTestResult({
        success: response.status === 200,
        message: `CORS test completed. Status: ${response.status}`,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('CORS test failed:', err);
      setTestResult({
        success: false,
        message: err.message || 'CORS test failed',
        error: err,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 m-4">
      <h2 className="text-xl font-bold mb-4">Network Connection Test</h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testDirectFetch}
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Testing...' : 'Test Direct Fetch'}
          </Button>
          
          <Button 
            onClick={testCors}
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Testing...' : 'Test CORS'}
          </Button>
        </div>

        {testResult && (
          <div className={`border rounded p-4 ${
            testResult.success 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <p className="font-medium">{testResult.message}</p>
            <p className="text-sm mt-2">Timestamp: {testResult.timestamp}</p>
            
            {testResult.data && (
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">Response Data</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </details>
            )}
            
            {testResult.headers && (
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">Response Headers</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(testResult.headers, null, 2)}
                </pre>
              </details>
            )}
            
            {testResult.error && (
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                  {JSON.stringify(testResult.error, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default NetworkTest; 