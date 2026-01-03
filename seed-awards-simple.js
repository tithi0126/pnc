const mongoose = require('mongoose');

// Award schema (inline)
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

async function seedAwards() {
  try {
    await connectDB();

    // Clear existing awards
    await Award.deleteMany({});
    console.log('Cleared existing awards');

    // Sample awards data
    const sampleAwards = [
      {
        title: "Best Nutrition Consultant 2024",
        description: "Recognized for outstanding contributions to nutrition education and client success stories.",
        organization: "Indian Dietetic Association",
        date: "2024-03-15",
        type: "award",
        isActive: true,
        sortOrder: 1
      },
      {
        title: "Healthcare Innovation Award",
        description: "Awarded for innovative approaches in personalized nutrition counseling.",
        organization: "Medical Excellence Council",
        date: "2023-11-20",
        type: "award",
        isActive: true,
        sortOrder: 2
      },
      {
        title: "Annual Nutrition Conference",
        description: "Keynote speaker at the International Nutrition and Dietetics Conference, sharing insights on sustainable health practices.",
        organization: "Nutrition Society of India",
        date: "2024-01-25",
        type: "event",
        isActive: true,
        sortOrder: 3
      },
      {
        title: "Corporate Wellness Workshop",
        description: "Led comprehensive wellness workshops for major corporations, focusing on preventive nutrition strategies.",
        organization: "Corporate Health Initiative",
        date: "2024-02-10",
        type: "event",
        isActive: true,
        sortOrder: 4
      }
    ];

    await Award.insertMany(sampleAwards);
    console.log(`Seeded ${sampleAwards.length} awards/events successfully`);

    // Verify the data
    const count = await Award.countDocuments();
    console.log(`Total awards in database: ${count}`);

  } catch (error) {
    console.error('Error seeding awards:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedAwards();
