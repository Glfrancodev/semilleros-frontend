import { useState } from "react";
import SignInForm from "../components/SignInForm";
import { useAuth } from "../../../context/AuthContext";

export default function SignInPage() {
  const { login, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <SignInForm onSubmit={handleLogin} loading={loading} />
      {error && (
        <div className="mt-4 text-center text-red-500">{error}</div>
      )}
    </div>
  );
}
