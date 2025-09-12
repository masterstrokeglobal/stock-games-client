"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useValidateOperatorPercentage } from "@/react-query/operator-queries";
import { Calculator, AlertTriangle, CheckCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { PercentageValidation } from "@/types/profit-loss";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
    operatorId: number;
    operatorName: string;
    currentPercentage: number;
    maxAllowed?: number;
    className?: string;
    onValidationComplete?: (result: PercentageValidation) => void;
};

const PercentageAllocationManager = ({ 
    operatorId, 
    operatorName, 
    currentPercentage, 
    maxAllowed,
    className,
    onValidationComplete 
}: Props) => {
    const [newPercentage, setNewPercentage] = useState<string>(currentPercentage.toString());
    const [validationResult, setValidationResult] = useState<PercentageValidation | null>(null);
    
    const { mutate: validatePercentage, isPending } = useValidateOperatorPercentage();

    const handleValidate = () => {
        const percentage = parseFloat(newPercentage);
        
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
            toast.error("Please enter a valid percentage between 0 and 100");
            return;
        }

        validatePercentage(
            { operatorId, newPercentage: percentage },
            {
                onSuccess: (result) => {
                    setValidationResult(result.data as PercentageValidation);
                    onValidationComplete?.(result.data as PercentageValidation);
                    
                    if (result.data.isValid) {
                        toast.success("Percentage allocation is valid!");
                    } else {
                        toast.error("Invalid percentage allocation");
                    }
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || "Validation failed");
                }
            }
        );
    };

    const handleReset = () => {
        setNewPercentage(currentPercentage.toString());
        setValidationResult(null);
    };

    const percentageChange = parseFloat(newPercentage) - currentPercentage;

    return (
        <div className={cn("space-y-4", className)}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Percentage Allocation Manager
                    </CardTitle>
                    <CardDescription>
                        Validate and set profit sharing percentage for {operatorName}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Current vs New */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Current Allocation</Label>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-700">
                                    {currentPercentage}%
                                </div>
                                <div className="text-sm text-gray-500">Current percentage</div>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="newPercentage">New Allocation</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        id="newPercentage"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={newPercentage}
                                        onChange={(e) => setNewPercentage(e.target.value)}
                                        className="pr-8"
                                        placeholder="Enter percentage"
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        %
                                    </span>
                                </div>
                                <Button 
                                    onClick={handleValidate}
                                    disabled={isPending || newPercentage === currentPercentage.toString()}
                                >
                                    {isPending ? "Validating..." : "Validate"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Change Indicator */}
                    {percentageChange !== 0 && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">
                                {percentageChange > 0 ? "Increase" : "Decrease"} of{" "}
                                <strong>{Math.abs(percentageChange).toFixed(2)}%</strong>
                                {percentageChange > 0 ? " 📈" : " 📉"}
                            </span>
                        </div>
                    )}

                    {/* Max Allowed Warning */}
                    {maxAllowed && (
                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                Maximum allowed allocation: <strong>{maxAllowed}%</strong>
                                {parseFloat(newPercentage) > maxAllowed && (
                                    <span className="text-red-600 ml-2">
                                        ⚠️ Exceeds maximum limit
                                    </span>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Validation Result */}
                    {validationResult && (
                        <div className="space-y-3">
                            <div className={cn(
                                "flex items-center gap-2 p-4 rounded-lg border",
                                validationResult.isValid 
                                    ? "bg-green-50 border-green-200 text-green-800"
                                    : "bg-red-50 border-red-200 text-red-800"
                            )}>
                                {validationResult.isValid ? (
                                    <CheckCircle className="h-5 w-5" />
                                ) : (
                                    <AlertTriangle className="h-5 w-5" />
                                )}
                                <div>
                                    <div className="font-medium">
                                        {validationResult.isValid ? "✅ Valid Allocation" : "❌ Invalid Allocation"}
                                    </div>
                                    <div className="text-sm">
                                        Requested: {validationResult.requested}% | 
                                        Max Allowed: {validationResult.maxAllowed}%
                                    </div>
                                </div>
                            </div>

                            {/* Validation Errors */}
                            {!validationResult.isValid && validationResult.errors.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-red-600">Validation Errors:</Label>
                                    {validationResult.errors.map((error, index) => (
                                        <Alert key={index} variant="destructive">
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    ))}
                                </div>
                            )}

                            {/* Success Actions */}
                            {validationResult.isValid && (
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={handleReset}>
                                        Reset
                                    </Button>
                                    <Button 
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => toast.success("Ready to apply allocation!")}
                                    >
                                        Apply Allocation
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2">
                        <Badge 
                            variant="outline" 
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => setNewPercentage("0")}
                        >
                            0%
                        </Badge>
                        <Badge 
                            variant="outline" 
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => setNewPercentage("10")}
                        >
                            10%
                        </Badge>
                        <Badge 
                            variant="outline" 
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => setNewPercentage("25")}
                        >
                            25%
                        </Badge>
                        <Badge 
                            variant="outline" 
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => setNewPercentage("50")}
                        >
                            50%
                        </Badge>
                        {maxAllowed && (
                            <Badge 
                                variant="outline" 
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => setNewPercentage(maxAllowed.toString())}
                            >
                                Max ({maxAllowed}%)
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PercentageAllocationManager;
