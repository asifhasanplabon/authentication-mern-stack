import mongoose from 'mongoose';

import bcrypt from 'bcrypt';

// database schema
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    roll:{
        type:String,
        required:true,
        unique:true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        minlength: 8
    },
    photo:{
        type: String,
        default:''
    },
    gender:{
        type: String,
        enum:['Male','Female'],
        required: true
    },
    session: {
        type: String,
        required: true
    },
    dept:{
        type: String,
        required:true
    },
    phone:{
        type: String,
        required:true
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    role:{
        type: String,
        enum:['student','admin'],
        default:'student'
    }

}, {timestamps: true});

//hash password before save...
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) {
        return next();
    }
    this.password=await bcrypt.hash(this.password,12);
});

// compare passwords
userSchema.methods.matchPassword= async function (entered) {
    return await bcrypt.compare(entered,this.password);
};

const User = mongoose.model('User',userSchema);
export default User;