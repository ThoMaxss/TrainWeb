"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function BackendTestPage() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult("");
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7128'}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.text();
        setResult(`✅ Backend kết nối thành công!\nResponse: ${data}`);
      } else {
        setResult(`❌ Backend response error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      setResult(`❌ Lỗi kết nối: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testAPI = async () => {
    setLoading(true);
    setResult("");
    
    try {
      // Test một endpoint cụ thể
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7128'}/api/train`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(`✅ API trains endpoint hoạt động!\nData: ${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`❌ API error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      setResult(`❌ Lỗi API call: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-3">Test Backend Connection</h1>
      
      <Card className="p-2 mb-3">
        <h2 className="text-lg font-semibold mb-3">Backend Configuration</h2>
        <div className="space-y-2 text-sm">
          <div><strong>Backend URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7128'}</div>
          <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
        </div>
      </Card>

      <div className="space-y-3 mb-3">
        <Button 
          onClick={testConnection} 
          disabled={loading}
          className="mr-3"
        >
          {loading ? "Đang test..." : "Test Health Check"}
        </Button>
        
        <Button 
          onClick={testAPI} 
          disabled={loading}
          variant="outline"
        >
          {loading ? "Đang test..." : "Test API Trains"}
        </Button>
      </div>

      {result && (
        <Card className="p-2">
          <h3 className="font-semibold mb-2">Kết quả:</h3>
          <pre className="whitespace-pre-wrap text-sm bg-card p-2 rounded">
            {result}
          </pre>
        </Card>
      )}
    </div>
  );
}