import mongoose, {
  Schema,
  model,
  models,
  Document,
} from "mongoose";

export type ApplicationStatus =
  | "draft"
  | "payment_pending"
  | "pending"
  | "approved"
  | "rejected"
  | "printed"
  | "dispatched"
  | "delivered";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed";

export interface Application
  extends Document {
  userId: mongoose.Types.ObjectId;

  applicationNumber: string;
  approvedBy?: mongoose.Types.ObjectId;
approvedAt?: Date;

rejectedBy?: mongoose.Types.ObjectId;
rejectedAt?: Date;

printedBy?: mongoose.Types.ObjectId;
printedAt?: Date;

dispatchedBy?: mongoose.Types.ObjectId;
dispatchedAt?: Date;

deliveredBy?: mongoose.Types.ObjectId;
deliveredAt?: Date;

  // Snapshot of user data
  fullName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  pinCode: string;

  gender:
    | "male"
    | "female"
    | "other";

  dateOfBirth: Date;

  // Sensitive
  aadharNumber: string;

  // Uploads
  photoUrl: string;
  signatureUrl: string;
  aadharDocumentUrl: string;

  // Status lifecycle
  status: ApplicationStatus;

  // Payment
  applicationFee: number;
  paymentStatus: PaymentStatus;

 paymentId?: string;
paymentDate?: Date;
paymentFailureReason?: string;

  // Validity
  validFrom?: Date;
  validTill?: Date;
  rejectionReason?: string;

  // Renewal
  isRenewal: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema =
  new Schema<Application>(
    {
      userId: {
        type:
          Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      applicationNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      // Snapshot fields
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        match: [
          /^[0-9]{10}$/,
          "Invalid phone number",
        ],
      },

      address: {
        type: String,
        required: true,
      },

      district: {
        type: String,
        required: true,
      },

      pinCode: {
        type: String,
        required: true,
        match: [
          /^[0-9]{6}$/,
          "Invalid PIN code",
        ],
      },

      gender: {
        type: String,
        enum: [
          "male",
          "female",
          "other",
        ],
        required: true,
      },

      dateOfBirth: {
        type: Date,
        required: true,
      },

      aadharNumber: {
        type: String,
        required: true,
        match: [
          /^[0-9]{12}$/,
          "Invalid Aadhaar number",
        ],
      },

      // Uploaded Documents
      photoUrl: {
        type: String,
        required: true,
      },

      signatureUrl: {
        type: String,
        required: true,
      },

      aadharDocumentUrl: {
        type: String,
        required: true,
      },

      // Application Status
      status: {
        type: String,
        enum: [
  "draft",
  "payment_pending",
  "pending",
  "approved",
  "rejected",
  "printed",
  "dispatched",
  "delivered",
],
        default: "draft",
        index: true,
      },

      // Fee
      applicationFee: {
        type: Number,
        default: 100,
      },

      paymentStatus: {
  type: String,
  enum: [
    "pending",
    "paid",
    "failed",
  ],
  default: "pending",
},

paymentFailureReason: {
  type: String,
  default: null,
},

paymentId: {
  type: String,
},

      paymentDate: {
        type: Date,
      },

      // Card validity
      validFrom: {
        type: Date,
      },

      validTill: {
        type: Date,
      },
approvedBy: {
  type: Schema.Types.ObjectId,
  ref: "User",
},

approvedAt: {
  type: Date,
},

rejectedBy: {
  type: Schema.Types.ObjectId,
  ref: "User",
},

rejectedAt: {
  type: Date,
},
rejectionReason: {
  type: String,
  default: null,
},
printedBy: {
  type: Schema.Types.ObjectId,
  ref: "User",
},

printedAt: {
  type: Date,
},

dispatchedBy: {
  type: Schema.Types.ObjectId,
  ref: "User",
},

dispatchedAt: {
  type: Date,
},

deliveredBy: {
  type: Schema.Types.ObjectId,
  ref: "User",
},

deliveredAt: {
  type: Date,
},
      // Renewal tracking
      isRenewal: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

const ApplicationModel =
  (models.Application as mongoose.Model<Application>) ||
  model<Application>(
    "Application",
    ApplicationSchema
  );

export default ApplicationModel;