"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NetworkDiagnosticPage() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [apiTests, setApiTests] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const checkBackendHealth = async () => {
    setBackendStatus('checking');
    addLog('Kiểm tra kết nối backend...');
    
    try {
      const response = await fetch('https://localhost:7128/api/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setBackendStatus('online');
        addLog(`✅ Backend online! Status: ${response.status}`);
      } else {
        setBackendStatus('offline');
        addLog(`❌ Backend response error: ${response.status}`);
      }
    } catch (error) {
      setBackendStatus('offline');
      addLog(`❌ Backend offline: ${error}`);
    }
  };

  const testSpecificEndpoint = async (endpoint: string, name: string) => {
    addLog(`Testing ${name}...`);
    try {
      const response = await fetch(`https://localhost:7128/api${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      const result = {
        name,
        endpoint,
        status: response.status,
        ok: response.ok,
        data: null as any
      };

      if (response.ok) {
        try {
          result.data = await response.json();
          addLog(`✅ ${name} success: ${response.status}`);
        } catch (e) {
          result.data = await response.text();
          addLog(`✅ ${name} success (text): ${response.status}`);
        }
      } else {
        const errorText = await response.text();
        result.data = errorText;
        addLog(`❌ ${name} failed: ${response.status} - ${errorText}`);
      }

      setApiTests(prev => [...prev, result]);
    } catch (error) {
      addLog(`❌ ${name} error: ${error}`);
      setApiTests(prev => [...prev, {
        name,
        endpoint, 
        status: 0,
        ok: false,
        data: String(error)
      }]);
    }
  };

  const runAllTests = async () => {
    setApiTests([]);
    setLogs([]);
    
    await checkBackendHealth();
    
    const endpoints = [
      { endpoint: '/train', name: 'Get All Trains' },
      { endpoint: '/trip', name: 'Get All Trips' },
      { endpoint: '/booking', name: 'Get All Bookings' }
    ];

    for (const test of endpoints) {
      await testSpecificEndpoint(test.endpoint, test.name);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="p-2 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-3">Network Diagnostic</h1>
      
      {/* Backend Status */}
      <Card className="p-2 mb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Backend Status</h2>
          <Badge variant={backendStatus === 'online' ? 'default' : backendStatus === 'offline' ? 'destructive' : 'secondary'}>
            {backendStatus === 'online' && '🟢 Online'}
            {backendStatus === 'offline' && '🔴 Offline'}  
            {backendStatus === 'checking' && '🟡 Checking...'}
          </Badge>
        </div>
        
        <div className="mt-3 space-y-2 text-sm">
          <div><strong>Backend URL:</strong> https://localhost:7128</div>
          <div><strong>API Base:</strong> /api</div>
          <div><strong>Frontend:</strong> http://localhost:3001</div>
        </div>
      </Card>

      {/* Controls */}
      <div className="flex gap-3 mb-3">
        <Button onClick={checkBackendHealth} disabled={backendStatus === 'checking'}>
          Refresh Backend Status
        </Button>
        <Button onClick={runAllTests} variant="outline">
          Test All API Endpoints
        </Button>
      </div>

      {/* API Test Results */}
      {apiTests.length > 0 && (
        <Card className="p-2 mb-3">
          <h2 className="text-lg font-semibold mb-3">API Test Results</h2>
          <div className="space-y-3">
            {apiTests.map((test, index) => (
              <div key={index} className="border rounded-lg p-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{test.name}</span>
                  <Badge variant={test.ok ? 'default' : 'destructive'}>
                    {test.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  GET {test.endpoint}
                </div>
                <details className="text-sm">
                  <summary className="cursor-pointer">Response Data</summary>
                  <pre className="mt-2 p-2 bg-card rounded overflow-auto max-h-40">
                    {typeof test.data === 'string' ? test.data : JSON.stringify(test.data, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Logs */}
      <Card className="p-2">
        <h2 className="text-lg font-semibold mb-3">Logs</h2>
        <div className="bg-black text-green-400 p-2 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-muted-foreground">No logs yet...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}