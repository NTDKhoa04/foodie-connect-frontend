"use client";
import { ReactNode, createContext, useContext, useState } from "react";

interface FormData {
  email: string;
  displayName: string;
  phoneNumber: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

export interface UserData {
  email: string;
  displayName: string;
  phoneNumber: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

interface MultiStepContextType {
  user: UserData[];
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  createUserData: (data: FormData) => void;
}

export const MultiStepContext = createContext({} as MultiStepContextType);

interface MultiStepContextProviderProps {
  children: ReactNode;
}

export function MultiStepContenxtProvider({
  children,
}: MultiStepContextProviderProps) {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<UserData[]>([]);

  function createUserData(data: FormData) {
    const newUser: UserData = {
      email: data.email,
      displayName: data.displayName,
      phoneNumber: data.phoneNumber,
      userName: data.userName,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };
    setUser([...user, newUser]);
  }
  function nextStep() {
    if (step === 4) return;
    setStep((prev) => prev + 1);
  }
  function prevStep() {
    if (step === 1) return;
    setStep((prev) => prev - 1);
  }

  return (
    <MultiStepContext.Provider
      value={{
        user,
        step,
        nextStep,
        prevStep,
        createUserData,
      }}
    >
      {children}
    </MultiStepContext.Provider>
  );
}

export const useMultiContext = () => useContext(MultiStepContext);
