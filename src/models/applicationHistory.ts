import mongoose, {
  Schema,
  model,
  models,
  Document,
} from "mongoose";

export interface ApplicationHistory
  extends Document {
  applicationId: mongoose.Types.ObjectId;

  performedBy: mongoose.Types.ObjectId;

  previousStatus: string;

  newStatus: string;

  action: string;

  remarks?: string;

  createdAt: Date;

  updatedAt: Date;
}

const ApplicationHistorySchema =
  new Schema<ApplicationHistory>(
    {
      applicationId: {
        type:
          Schema.Types.ObjectId,
        ref: "Application",
        required: true,
        index: true,
      },

      performedBy: {
        type:
          Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      previousStatus: {
        type: String,
        required: true,
      },

      newStatus: {
        type: String,
        required: true,
      },

      action: {
        type: String,
        required: true,
      },

      remarks: {
        type: String,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

const ApplicationHistoryModel =
  (models.ApplicationHistory as mongoose.Model<ApplicationHistory>) ||
  model<ApplicationHistory>(
    "ApplicationHistory",
    ApplicationHistorySchema
  );

export default ApplicationHistoryModel;