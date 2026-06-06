import mongoose, {
  Schema,
  model,
  models,
} from "mongoose";

const SettingsSchema =
  new Schema(
    {
      applicationsEnabled: {
        type: Boolean,
        default: true,
      },

      applicationDisabledMessage:
        {
          type: String,
          default:
            "Applications are temporarily closed.",
        },

      cardFee: {
        type: Number,
        default: 100,
      },

      cardValidityYears: {
        type: Number,
        default: 5,
      },
    },
    {
      timestamps: true,
    }
  );

const SettingsModel =
  models.Settings ||
  model(
    "Settings",
    SettingsSchema
  );

export default SettingsModel;