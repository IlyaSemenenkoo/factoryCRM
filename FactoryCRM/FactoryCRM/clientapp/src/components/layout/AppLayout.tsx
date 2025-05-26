import { Outlet } from "react-router-dom";
import { LogoutButton } from "../LogoutButton";
import { ReactNode } from "react";

export const AppLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white flex items-center justify-between px-6 py-4 shadow-md">
        <h1 className="text-xl font-bold">Factory CRM</h1>
        <LogoutButton />
      </header>

      <main className="flex-1 p-6 bg-gray-100">
        {children}
        </main>
    </div>
  );
};
