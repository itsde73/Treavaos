import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { StaffProvider } from "./context/StaffContext";

export default function App() {
  return (
    <StaffProvider>
      <RouterProvider router={router} />
      <Toaster />
    </StaffProvider>
  );
}
