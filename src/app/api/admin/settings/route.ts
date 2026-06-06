import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";

import SettingsModel from "@/models/settings";

export async function GET() {
  try {
    await dbConnect();

    let settings =
      await SettingsModel.findOne();

    if (!settings) {
      settings =
        await SettingsModel.create({
          applicationsEnabled: true,
          applicationDisabledMessage:
            "Applications are temporarily closed.",
          cardFee: 100,
          cardValidityYears: 5,
        });
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch settings",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request
) {
  try {
    await dbConnect();

    const body =
      await request.json();

    let settings =
      await SettingsModel.findOne();

    if (!settings) {
      settings =
        await SettingsModel.create(
          body
        );
    } else {
      Object.assign(
        settings,
        body
      );

      await settings.save();
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update settings",
      },
      {
        status: 500,
      }
    );
  }
}