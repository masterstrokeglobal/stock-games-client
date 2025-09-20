"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function ApiConnectionTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);

  const testApiConnection = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/external-users/transactions?page=1&limit=5', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `API connected successfully! Found ${data.data?.transactions?.length || 0} transactions.`,
          data: data.data,
        });
      } else {
        setResult({
          success: false,
          message: `API Error: ${data.message || 'Unknown error'} (Status: ${response.status})`,
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: `Connection Error: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
        <CardDescription>
          Test the connection to the external user transactions API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testApiConnection} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            'Test API Connection'
          )}
        </Button>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? 'Success' : 'Error'}
              </span>
            </div>
            <p className={`text-sm ${
              result.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {result.message}
            </p>
            
            {result.data && (
              <div className="mt-3 p-3 bg-gray-50 rounded border">
                <h4 className="font-medium text-sm mb-2">Response Data:</h4>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p><strong>API Endpoint:</strong> http://localhost:8000/api/external-users/transactions</p>
          <p><strong>Expected:</strong> Authentication required (Super Admin token)</p>
          <p><strong>Note:</strong> This test may fail due to authentication requirements</p>
        </div>
      </CardContent>
    </Card>
  );
}
