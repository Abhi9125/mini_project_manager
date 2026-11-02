import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/project_management';
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(mongoUri);

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    console.log('Creating demo user...');
    const demoUser = await User.create({
      name: 'Alex Developer',
      email: 'admin@example.com',
      password: 'password123',
    });

    console.log('Creating demo projects...');
    const now = new Date();

    const project1 = await Project.create({
      title: 'Mobile App Redesign',
      description: 'Revamping iOS and Android apps with new design system, navigation, and offline sync.',
      userId: demoUser._id,
    });

    const project2 = await Project.create({
      title: 'Marketing Website Launch',
      description: 'Landing page overhaul, SEO optimizations, and blog migration for Q3 product announcement.',
      userId: demoUser._id,
    });

    const project3 = await Project.create({
      title: 'API Performance & Refactoring',
      description: 'Auditing slow database queries, implementing Redis caching, and refactoring auth flow.',
      userId: demoUser._id,
    });

    console.log('Creating demo tasks...');
    const day = 24 * 60 * 60 * 1000;

    await Task.create([
      // Tasks for Project 1
      {
        title: 'Design component Figma kit',
        description: 'Complete typography, color tokens, and button states in Figma design system.',
        status: 'done',
        dueDate: new Date(now.getTime() - 2 * day),
        projectId: project1._id,
        userId: demoUser._id,
      },
      {
        title: 'Implement bottom navigation bar',
        description: 'Build animated bottom tab navigation with active state indicator.',
        status: 'in-progress',
        dueDate: new Date(now.getTime() + 1 * day),
        projectId: project1._id,
        userId: demoUser._id,
      },
      {
        title: 'Setup push notification listeners',
        description: 'Integrate Firebase Cloud Messaging SDK and handle foreground/background notifications.',
        status: 'todo',
        dueDate: new Date(now.getTime() + 4 * day),
        projectId: project1._id,
        userId: demoUser._id,
      },
      {
        title: 'Biometric authentication screen',
        description: 'Add FaceID and fingerprint unlock option in security settings tab.',
        status: 'todo',
        dueDate: new Date(now.getTime() + 7 * day),
        projectId: project1._id,
        userId: demoUser._id,
      },

      // Tasks for Project 2
      {
        title: 'Hero section responsive layout',
        description: 'Ensure hero banner looks sharp on mobile, tablet, and 4k displays.',
        status: 'done',
        dueDate: new Date(now.getTime() - 1 * day),
        projectId: project2._id,
        userId: demoUser._id,
      },
      {
        title: 'Pricing calculator component',
        description: 'Create interactive slider calculating monthly vs annual subscription pricing tiers.',
        status: 'in-progress',
        dueDate: new Date(now.getTime() + 2 * day),
        projectId: project2._id,
        userId: demoUser._id,
      },
      {
        title: 'Connect newsletter signup form to CRM',
        description: 'Integrate form submission webhook with email marketing provider.',
        status: 'todo',
        dueDate: new Date(now.getTime() + 5 * day),
        projectId: project2._id,
        userId: demoUser._id,
      },

      // Tasks for Project 3
      {
        title: 'Database indexing audit',
        description: 'Analyze slow query logs and add composite indexes to high-throughput collections.',
        status: 'done',
        dueDate: new Date(now.getTime() - 3 * day),
        projectId: project3._id,
        userId: demoUser._id,
      },
      {
        title: 'Load testing with k6',
        description: 'Simulate 5,000 concurrent active users on core API endpoints and benchmark p99 latency.',
        status: 'in-progress',
        dueDate: new Date(now.getTime() + 3 * day),
        projectId: project3._id,
        userId: demoUser._id,
      },
    ]);

    console.log('✅ Seeding complete!');
    console.log('------------------------------------');
    console.log('Demo Account:');
    console.log('  Email:    admin@example.com');
    console.log('  Password: password123');
    console.log('------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
