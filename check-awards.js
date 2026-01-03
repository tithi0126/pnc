const mongoose = require('./backend/utils/database');
const Award = require('./backend/models/Award');

async function checkAwards() {
  try {
    await mongoose.connectDB();
    const awards = await Award.find({});
    console.log('Total awards in database:', awards.length);
    awards.forEach((award, index) => {
      console.log(`${index + 1}. ${award.title} (${award.type}) - Active: ${award.isActive}`);
    });
  } catch (error) {
    console.error('Error checking awards:', error);
  } finally {
    process.exit(0);
  }
}

checkAwards();
