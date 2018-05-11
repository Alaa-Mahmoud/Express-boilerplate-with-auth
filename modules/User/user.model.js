import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true
    },
    local: {
        email: {
            type: String,
            lowercase: true
        },
        password: {
            type: String,
        }
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },

});

UserSchema.pre('save', async function(next) {
    try {
        if (this.method !== 'local') { return next() };

        console.log('called');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.local.password, salt);
        this.local.password = passwordHash;
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.isValidPassword = async function(enteredPassword) {
    try {
        console.log('password', this.local.password);
        console.log('enteredpassword', enteredPassword);

        return await bcrypt.compare(enteredPassword, this.local.password);
    } catch (error) {
        throw new Error(error);
    }
};



const User = mongoose.model('User', UserSchema);

export default User;