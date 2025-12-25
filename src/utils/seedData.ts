import { localDB } from '../integrations/supabase/client';

export const seedDatabase = async () => {
  try {
    // Check if data already exists
    const existingServices = await localDB.find('services');
    if (existingServices.length > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    // Seed services
    const services = [
      {
        title: 'Weight Management Consultation',
        shortDescription: 'Comprehensive weight management programs tailored to your lifestyle and health goals.',
        fullDescription: 'Our weight management consultation provides a holistic approach to achieving and maintaining a healthy weight. We analyze your current health status, dietary habits, lifestyle factors, and create personalized plans that are sustainable and effective.',
        icon: 'Apple',
        duration: '45-60 minutes',
        idealFor: 'Individuals looking to lose, gain, or maintain weight',
        benefits: ["Personalized meal plans", "Exercise recommendations", "Ongoing support and monitoring", "Nutrient deficiency correction", "Sustainable lifestyle changes"],
        isActive: true,
        sortOrder: 1,
      },
      {
        title: 'Nutrition for Chronic Conditions',
        shortDescription: 'Specialized nutritional guidance for managing diabetes, hypertension, and other chronic conditions.',
        fullDescription: 'Managing chronic conditions through nutrition requires specialized knowledge and careful planning. Our consultations focus on using food as medicine to help control symptoms, prevent complications, and improve quality of life.',
        icon: 'Heart',
        duration: '60 minutes',
        idealFor: 'Patients with diabetes, hypertension, thyroid issues',
        benefits: ["Blood sugar management", "Blood pressure control", "Medication interaction guidance", "Symptom management through diet", "Preventive nutrition strategies"],
        isActive: true,
        sortOrder: 2,
      },
      {
        title: 'Sports Nutrition',
        shortDescription: 'Fuel your body optimally for athletic performance and recovery.',
        fullDescription: 'Whether you\'re a professional athlete or a weekend warrior, proper nutrition is key to optimal performance. We create customized nutrition plans that enhance energy levels, support muscle recovery, and maximize training results.',
        icon: 'Zap',
        duration: '45 minutes',
        idealFor: 'Athletes and active individuals',
        benefits: ["Performance optimization", "Muscle recovery enhancement", "Injury prevention", "Energy level stabilization", "Competition preparation"],
        isActive: true,
        sortOrder: 3,
      }
    ];

    for (const service of services) {
      await localDB.insertOne('services', service);
    }

    // Seed testimonials
    const testimonials = [
      {
        name: 'Priya Sharma',
        role: 'Working Professional',
        location: 'Mumbai, India',
        content: 'Dr. Shah transformed my relationship with food completely. Her personalized approach helped me lose 15kg sustainably, and I feel more energetic than ever. The best investment I made for my health!',
        rating: 5,
        isApproved: true,
        isFeatured: true,
      },
      {
        name: 'Rajesh Patel',
        role: 'Business Owner',
        location: 'Ahmedabad, India',
        content: 'After struggling with diabetes for years, Dr. Shah\'s nutrition plan helped me control my blood sugar levels naturally. I\'ve reduced my medication and feel much healthier. Highly recommended!',
        rating: 5,
        isApproved: true,
        isFeatured: true,
      },
      {
        name: 'Meera Joshi',
        role: 'Teacher',
        location: 'Pune, India',
        content: 'The prenatal nutrition guidance was invaluable during my pregnancy. Dr. Shah ensured both I and my baby got all the necessary nutrients while managing pregnancy-related symptoms and supporting recovery after birth.',
        rating: 5,
        isApproved: true,
        isFeatured: false,
      }
    ];

    for (const testimonial of testimonials) {
      await localDB.insertOne('testimonials', testimonial);
    }

    // Seed gallery images
    const galleryImages = [
      {
        title: 'Healthy Meal Prep',
        altText: 'Colorful healthy meal preparation with fresh vegetables and proteins',
        imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop',
        category: 'Healthy Food',
        isActive: true,
        sortOrder: 1,
      },
      {
        title: 'Nutrition Consultation',
        altText: 'Professional nutrition consultation session',
        imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
        category: 'Consultation',
        isActive: true,
        sortOrder: 2,
      }
    ];

    for (const image of galleryImages) {
      await localDB.insertOne('gallery', image);
    }

    // Seed settings
    const settings = [
      { key: 'site_name', value: 'Dr. Bidita Shah - Nutrition Consultant' },
      { key: 'contact_email', value: 'contact@drbiditashah.com' },
      { key: 'whatsapp_number', value: '+91 98765 43210' },
    ];

    for (const setting of settings) {
      await localDB.insertOne('settings', setting);
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
