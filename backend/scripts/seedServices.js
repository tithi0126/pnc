const mongoose = require('mongoose');
const Service = require('../models/Service');
require('dotenv').config();

const seedServices = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nutrition_care';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if services already exist
    const existingServices = await Service.countDocuments();
    if (existingServices > 0) {
      console.log(`Found ${existingServices} existing services. Skipping seeding.`);
      console.log('To re-seed, delete existing services first.');
      return;
    }

    // Sample services data
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
      },
      {
        title: 'Prenatal & Postnatal Nutrition',
        shortDescription: 'Comprehensive nutritional support for expecting and new mothers.',
        fullDescription: 'Pregnancy and postpartum periods require special nutritional attention. We provide guidance on nutrient needs, morning sickness management, gestational diabetes prevention, and postpartum recovery through optimal nutrition.',
        icon: 'Baby',
        duration: '50 minutes',
        idealFor: 'Pregnant women and new mothers',
        benefits: ["Optimal fetal development", "Morning sickness relief", "Gestational diabetes prevention", "Postpartum recovery", "Breastfeeding nutrition"],
        isActive: true,
        sortOrder: 4,
      },
      {
        title: 'Corporate Wellness Programs',
        shortDescription: 'Healthy eating programs designed for workplace wellness and productivity.',
        fullDescription: 'We design comprehensive nutrition programs for companies looking to improve employee health, reduce absenteeism, and boost productivity through better nutrition education and meal planning.',
        icon: 'Building',
        duration: 'Customized',
        idealFor: 'Corporate teams and organizations',
        benefits: ["Employee health improvement", "Productivity enhancement", "Reduced healthcare costs", "Team building through wellness", "Sustainable healthy habits"],
        isActive: true,
        sortOrder: 5,
      },
      {
        title: 'Child & Adolescent Nutrition',
        shortDescription: 'Specialized nutrition guidance for growing children and teenagers.',
        fullDescription: 'Proper nutrition during childhood and adolescence is crucial for growth, development, and establishing healthy eating habits. We address picky eating, growth concerns, and nutritional needs for optimal development.',
        icon: 'Users',
        duration: '40 minutes',
        idealFor: 'Children and teenagers',
        benefits: ["Optimal growth support", "Healthy eating habit formation", "Picky eating solutions", "Academic performance improvement", "Long-term health foundation"],
        isActive: true,
        sortOrder: 6,
      }
    ];

    // Insert services
    const insertedServices = await Service.insertMany(services);
    console.log(`Successfully seeded ${insertedServices.length} services to MongoDB`);

    // Display inserted services
    console.log('\nSeeded Services:');
    insertedServices.forEach((service, index) => {
      console.log(`${index + 1}. ${service.title} (${service.isActive ? 'Active' : 'Inactive'})`);
    });

  } catch (error) {
    console.error('Error seeding services:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
if (require.main === module) {
  seedServices();
}

module.exports = { seedServices };
