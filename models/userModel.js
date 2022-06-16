const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// connecting to db
// mongoose.connect("mongodb://localhost:27017/test", { useUnifiedTopology: true, useNewUrlParser: true },
//     function(err) {
//         if (err) throw err;
//     })

// const db = mongoose.connection;
// db.once('open', () => {
//     console.log("Connected to MongoDb database...")
// })

const userSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        requires: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });
//add image later

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema);

module.exports = User;