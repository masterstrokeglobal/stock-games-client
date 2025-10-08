"use client";

/**
 * TEMPORARY DEBUG COMPONENT
 * 
 * Add this to your bet-history page to see the raw API response.
 * Remove once you've debugged the pagination issue.
 * 
 * Usage:
 * import DebugPanel from "./debug-panel";
 * <DebugPanel data={data} filters={filters} />
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DebugPanelProps {
    data: any;
    filters: any;
    totalPages?: number;
    totalCount?: number;
}

const DebugPanel = ({ data, filters, totalPages, totalCount }: DebugPanelProps) => {
    return (
        <Card className="border-2 border-yellow-500 bg-yellow-50">
            <CardHeader>
                <CardTitle className="text-yellow-800">
                    🐛 Debug Panel (Remove in Production)
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold text-sm mb-2">Current Filters:</h3>
                    <pre className="bg-white p-2 rounded text-xs overflow-auto">
                        {JSON.stringify(filters, null, 2)}
                    </pre>
                </div>

                <div>
                    <h3 className="font-semibold text-sm mb-2">Calculated Values:</h3>
                    <div className="bg-white p-2 rounded text-xs space-y-1">
                        <p>Total Pages: <strong>{totalPages}</strong></p>
                        <p>Total Count: <strong>{totalCount}</strong></p>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-sm mb-2">Raw API Response Structure:</h3>
                    <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-96">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>

                <div className="bg-white p-3 rounded">
                    <h3 className="font-semibold text-sm mb-2 text-green-700">
                        ✅ What to Look For:
                    </h3>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                        <li>Does <code>data.data.pagination</code> exist?</li>
                        <li>Does <code>data.data.pagination.total</code> or <code>totalPages</code> exist?</li>
                        <li>Does <code>data.data.count</code> exist?</li>
                        <li>Is there more than 20 records in the database?</li>
                        <li>Are the calculated totalPages &gt; 1?</li>
                    </ul>
                </div>

                <div className="bg-red-50 border border-red-200 p-3 rounded">
                    <h3 className="font-semibold text-sm mb-2 text-red-700">
                        ⚠️ Remember:
                    </h3>
                    <p className="text-xs text-red-600">
                        Delete this component and remove its import from the page once debugging is complete!
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default DebugPanel;


