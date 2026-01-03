const mongoose = require('mongoose');

// Award schema (inline for migration)
const awardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  organization: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['award', 'event'],
    default: 'award',
    required: true
  },
  imageUrl: {
    type: String
  },
  images: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Award = mongoose.model('Award', awardSchema);

// Connect to database
const connectDB = async (retries = 5) => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pnc';

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      family: 4
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection error:', error.message);
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return connectDB(retries - 1);
    }
    throw error;
  }
};

async function migrateAwardsImages() {
  try {
    await connectDB();

    // Find all awards
    const awards = await Award.find({});

    console.log(`Found ${awards.length} awards to migrate`);

    for (let i = 0; i < awards.length; i++) {
      const award = awards[i];

      // If award has imageUrl but no images array, migrate it
      if (award.imageUrl && (!award.images || award.images.length === 0)) {
        award.images = [award.imageUrl];
        award.imageUrl = undefined; // Remove old field
        await award.save();
        console.log(`Migrated award: ${award.title}`);
      }
      // If award has no imageUrl but no images array, initialize empty array
      else if (!award.images) {
        award.images = [];
        await award.save();
        console.log(`Initialized images array for: ${award.title}`);
      }
    }

    console.log('Migration completed successfully');

  } catch (error) {
    console.error('Error migrating awards:', error);
  } finally {
    mongoose.connection.close();
  }
}

migrateAwardsImages();
