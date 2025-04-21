
import React from "react";
import AuthForm from "@/components/auth/AuthForm";

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <AuthForm />
    </div>
  );
};

export default AuthPage;
