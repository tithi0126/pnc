import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { seedDatabase } from "./utils/seedData";
import { DatabaseStatus } from "./integrations/supabase/client";
import "./utils/dbChecker"; // Makes database utilities available globally
import "./utils/testDbConnection"; // Makes database test utilities available globally

// Add gallery debugging utility to global window
declare global {
  interface Window {
    debugGallery: () => void;
  }
}

window.debugGallery = async () => {
  try {
    const { galleryAPI } = await import('./lib/api');
    const data = await galleryAPI.getAll();
    console.log('Gallery debug data:', data);
    console.log('Total images:', data?.length || 0);
    console.log('Active images:', data?.filter((img: any) => img.isActive || img.is_active) || []);
  } catch (error) {
    console.error('Gallery debug error:', error);
  }
};

// Initialize app and seed data
const initApp = async () => {
  // Check and log database connections
  console.log('🔄 Initializing Vitality Hub Admin Panel...');
  await DatabaseStatus.logAllConnections();

  // Seed database with initial data (only in development)
  if (import.meta.env.DEV) {
    console.log('🌱 Seeding database with sample data...');
    await seedDatabase();
    console.log('✅ Database seeding completed');
  }

  console.log('🚀 Starting React application...');
  createRoot(document.getElementById("root")!).render(<App />);
  console.log('✅ Application started successfully');
};

initApp().catch((error) => {
  console.error('❌ Failed to initialize application:', error);
});
