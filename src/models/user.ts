import mongoose, { Schema, Document, models, model } from "mongoose";

export type Gender = "male" | "female" | "other";
export type Role = "user" | "approver" | "dispatcher" | "admin";

export interface User extends Document {
    name: string;
    email: string;
    password: string;

    isVerified: boolean;

    otp?: string;
    otpExpiry?: Date;
    otpAttempts?: number;
    otpResendCount?: number;
    otpLastSentAt?: Date;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
    resetPasswordToken?: string;
    resetPasswordExpiry?: Date;

    // Profile fields
    phone?: string;
    address?: string;
    pinCode?: string;
    district?: string;
    gender?: Gender;
    dateOfBirth?: Date;

    role: Role;

    isDeleted: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<User>(
    {
        // Basic Auth
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            index: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
        },

        // Verification
        isVerified: {
            type: Boolean,
            default: false,
        },

        otp: String,
        otpExpiry: Date,
        otpAttempts: {
            type: Number,
            default: 0,
        },

        // Resend control 
        otpResendCount: {
            type: Number,
            default: 0,
        },

        otpLastSentAt: {
            type: Date,
        },
        verifyToken: String,
        verifyTokenExpiry: Date,

        resetPasswordToken: String,

        resetPasswordExpiry: Date,

        // Profile (filled after login)
        phone: {
            type: String,
            trim: true,
            length: 10,

        },

        address: {
            type: String,
        },

        pinCode: {
            type: String,
        },

        district: {
            type: String,
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },

        dateOfBirth: {
            type: Date,
        },

        // Role-based access
        role: {
            type: String,
            enum: ["user", "approver", "dispatcher", "admin"],
            default: "user",
        },

        // Soft delete
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);
const Usermodel = (mongoose.models.User as mongoose.Model<User>) || model<User>("User", UserSchema);

export default Usermodel;