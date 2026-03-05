import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { StaffProvider } from "./context/StaffContext";
import { OutletProvider } from "./context/OutletContext";

export default function App() {
  return (
    <AuthProvider>
      <OutletProvider>
        <StaffProvider>
          <RouterProvider router={router} />
          <Toaster />
        </StaffProvider>
      </OutletProvider>
    </AuthProvider>
  );
}
