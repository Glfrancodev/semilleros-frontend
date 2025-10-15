import { Routes, Route } from "react-router-dom";
import SignInPage from "../pages/SignInPage";

export default function AuthRoutes() {
	return (
		<Routes>
			<Route path="/login" element={<SignInPage />} />
			{/* Puedes agregar más rutas como /signup, /reset-password aquí */}
		</Routes>
	);
}
