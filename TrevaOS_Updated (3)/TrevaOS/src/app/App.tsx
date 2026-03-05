import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { StaffProvider } from "./context/StaffContext";
import { OutletProvider } from "./context/OutletContext";

export default function App() {
  return (
    <OutletProvider>
      <StaffProvider>
        <RouterProvider router={router} />
        <Toaster />
      </StaffProvider>
    </OutletProvider>
  );
}
