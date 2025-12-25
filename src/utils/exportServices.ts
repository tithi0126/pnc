import { servicesAPI } from '../lib/api';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Export Services Utility
 * Fetches services data from the current API source (MongoDB or localStorage)
 * and saves it to a JSON file for backup or migration purposes.
 */

interface ExportedService {
  _id?: string;
  id?: string;
  title: string;
  shortDescription?: string;
  fullDescription?: string;
  icon?: string;
  duration?: string;
  idealFor?: string;
  benefits: string[];
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
  // Legacy field support
  short_description?: string;
  full_description?: string;
  ideal_for?: string;
  is_active?: boolean;
  sort_order?: number;
}

export const exportServices = async (outputPath?: string): Promise<void> => {
  try {
    console.log('🔄 Starting services export...');

    // Fetch all services (admin version to get all services, not just active ones)
    console.log('📡 Fetching services from API...');
    const services = await servicesAPI.getAllAdmin();
    console.log(`✅ Fetched ${services.length} services`);

    // Transform data for export consistency
    const exportData: ExportedService[] = services.map((service: any) => ({
      _id: service._id?.toString(),
      title: service.title || '',
      shortDescription: service.shortDescription || service.short_description || '',
      fullDescription: service.fullDescription || service.full_description || '',
      icon: service.icon || 'Apple',
      duration: service.duration || '',
      idealFor: service.idealFor || service.ideal_for || '',
      benefits: Array.isArray(service.benefits) ? service.benefits : [],
      isActive: service.isActive ?? service.is_active ?? true,
      sortOrder: service.sortOrder ?? service.sort_order ?? 0,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }));

    // Prepare export data structure
    const exportJson = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalServices: exportData.length,
        activeServices: exportData.filter(s => s.isActive).length,
        source: 'API (MongoDB/localStorage)',
      },
      services: exportData,
    };

    // Determine output path
    const defaultPath = path.join(process.cwd(), 'services-export.json');
    const finalOutputPath = outputPath || defaultPath;

    // Ensure directory exists
    const outputDir = path.dirname(finalOutputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(finalOutputPath, JSON.stringify(exportJson, null, 2), 'utf-8');

    console.log(`💾 Services exported successfully to: ${finalOutputPath}`);
    console.log(`📊 Summary: ${exportData.length} total services, ${exportData.filter(s => s.isActive).length} active`);

    // Log service titles for verification
    console.log('\n📋 Exported Services:');
    exportData.forEach((service, index) => {
      const status = service.isActive ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${service.title}`);
    });

  } catch (error) {
    console.error('❌ Error exporting services:', error);
    throw error;
  }
};

/**
 * Export only active services (for production use)
 */
export const exportActiveServices = async (outputPath?: string): Promise<void> => {
  try {
    console.log('🔄 Starting active services export...');

    // Fetch active services (public version)
    console.log('📡 Fetching active services from API...');
    const services = await servicesAPI.getAll();
    console.log(`✅ Fetched ${services.length} active services`);

    // Transform data for export consistency
    const exportData: ExportedService[] = services.map((service: any) => ({
      _id: service._id?.toString(),
      title: service.title || '',
      shortDescription: service.shortDescription || service.short_description || '',
      fullDescription: service.fullDescription || service.full_description || '',
      icon: service.icon || 'Apple',
      duration: service.duration || '',
      idealFor: service.idealFor || service.ideal_for || '',
      benefits: Array.isArray(service.benefits) ? service.benefits : [],
      isActive: service.isActive ?? service.is_active ?? true,
      sortOrder: service.sortOrder ?? service.sort_order ?? 0,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }));

    // Prepare export data structure
    const exportJson = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalServices: exportData.length,
        source: 'API (Active Services Only)',
        note: 'This export contains only active services as shown on the main website',
      },
      services: exportData,
    };

    // Determine output path
    const defaultPath = path.join(process.cwd(), 'active-services-export.json');
    const finalOutputPath = outputPath || defaultPath;

    // Ensure directory exists
    const outputDir = path.dirname(finalOutputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(finalOutputPath, JSON.stringify(exportJson, null, 2), 'utf-8');

    console.log(`💾 Active services exported successfully to: ${finalOutputPath}`);
    console.log(`📊 Summary: ${exportData.length} active services`);

    // Log service titles for verification
    console.log('\n📋 Active Services:');
    exportData.forEach((service, index) => {
      console.log(`${index + 1}. ${service.title}`);
    });

  } catch (error) {
    console.error('❌ Error exporting active services:', error);
    throw error;
  }
};

// CLI usage example
if (require.main === module) {
  const args = process.argv.slice(2);
  const customPath = args[0];
  const exportActiveOnly = args.includes('--active-only') || args.includes('-a');

  if (exportActiveOnly) {
    exportActiveServices(customPath).catch(console.error);
  } else {
    exportServices(customPath).catch(console.error);
  }
}
