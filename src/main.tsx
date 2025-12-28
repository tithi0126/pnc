import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Add gallery debugging utility to global window
declare global {
  interface Window {
    debugGallery: () => void;
  }
}


// Initialize app and seed data
const initApp = async () => {
  createRoot(document.getElementById("root")!).render(<App />);
};

initApp().catch((error) => {
  console.error('❌ Failed to initialize application:', error);
});
