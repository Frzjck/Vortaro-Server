const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');


// Load env
dotenv.config({
    path: "./config/config.env"
});

// Load models
const Group = require('./models/Group');
const Word = require('./models/Word');
const User = require('./models/User');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Read JSON files
const groups = JSON.parse(fs.readFileSync(`${__dirname}/_data/groups.json`, "utf-8"));
const words = JSON.parse(fs.readFileSync(`${__dirname}/_data/words.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8"));

// Import into DB
const importData = async (x) => {
    try {
        await Group.create(groups);
        await Word.create(words);
        await User.create(users);

        console.log('Data Imported...'.green.inverse);

    } catch (err) {
        console.error(err);
    }
    if (x) process.exit();
};

// Delete data
const deleteData = async (x) => {
    try {
        await Group.deleteMany();
        await Word.deleteMany();
        await User.deleteMany();

        console.log('Data DELETED...'.red.inverse);
    } catch (err) {
        console.error(err);
    }
    if (x) process.exit();
};

// Reset Data
const resetData = async () => {
    try {
        await deleteData();
        await importData();
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

if (process.argv[2] === "-i") {
    importData(true);
} else if (process.argv[2] === "-d") {
    deleteData(true);
} else if (process.argv[2] === "-r") {
    resetData();
}