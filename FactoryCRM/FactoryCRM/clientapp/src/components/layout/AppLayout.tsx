import { LogoutButton } from "../LogoutButton";
import { ReactNode } from "react";

export const AppLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">FactoryCRM</h1>
        <LogoutButton />
      </header>
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};
