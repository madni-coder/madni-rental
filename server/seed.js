require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@razvi.com';
    const existing = await User.findOne({ email });
    if (existing) {
        console.log('Admin user already exists:', email);
        await mongoose.disconnect();
        return;
    }

    const passwordHash = await bcrypt.hash('111', 12);
    await User.create({ name: 'Admin', email, passwordHash });
    console.log('Admin user created — email:', email, '| password: 111');
    await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
