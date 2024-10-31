import React, { PropsWithChildren, createContext, useContext, useState } from 'react';

interface StepperContextType {
    currentStep: number;
    nextStep: () => void;
    prevStep: () => void;
    resetStepper: () => void;
    goToStep: (step: number) => void;
}

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export const useStepper = () => {
    const context = useContext(StepperContext);
    if (!context) {
        throw new Error('useStepper must be used within a StepperProvider');
    }
    return context;
};

type StepperProviderProps = PropsWithChildren<{
    initialStep?: number;
}>;

export const StepperProvider = ({ children, initialStep }: StepperProviderProps) => {
    const [currentStep, setCurrentStep] = useState<number>(initialStep || 0);

    const nextStep = () => setCurrentStep(prevStep => prevStep + 1);

    const prevStep = () => setCurrentStep(prevStep => prevStep - 1);

    const resetStepper = () => setCurrentStep(0);

    const goToStep = (step: number) => setCurrentStep(step);

    const value: StepperContextType = {
        currentStep,
        nextStep,
        prevStep,
        goToStep,
        resetStepper
    };

    return (
        <StepperContext.Provider value={value}>
            {children}
        </StepperContext.Provider>
    );
};
