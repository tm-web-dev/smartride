import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";

import SettingsModel from "@/models/settings";

export async function GET() {
  try {
    await dbConnect();

    const settings =
      await SettingsModel.findOne();

    return NextResponse.json({
      success: true,

      applicationsEnabled:
        settings?.applicationsEnabled ??
        true,

      applicationDisabledMessage:
        settings?.applicationDisabledMessage ??
        "",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}