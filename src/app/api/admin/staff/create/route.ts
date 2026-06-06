import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";

import Usermodel from "@/models/user";

import { hashPassword } from "@/lib/bcrypt";
import { Resend } from "resend";

const resend = new Resend(
  process.env.RESENDER_API_KEY
);

export async function POST(
  request: Request
) {
  try {
    await dbConnect();

    const body =
      await request.json();

    const {
      name,
      email,
      password,
    } = body;

    if (
      !name ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser =
      await Usermodel.findOne({
        email:
          email
            .toLowerCase()
            .trim(),
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email already exists",
        },
        {
          status: 409,
        }
      );
    }

    const hashedPassword =
      await hashPassword(
        password
      );

    const staff =
  await Usermodel.create({
    name,

    email,

    password: hashedPassword,

    role: "staff",

    isVerified: true,

    mustChangePassword: true,
  });

  await resend.emails.send({
  from:
    "SmartRide <no-reply@crewofficials.com>",

  to: email,

  subject:
    "Your SmartRide Staff Account",

  html: `
    <div style="font-family:Arial,sans-serif">

      <h2>
        Welcome To SmartRide
      </h2>

      <p>
        Your staff account has been created.
      </p>

      <p>
        <strong>Email:</strong>
        ${email}
      </p>

      <p>
        <strong>Password:</strong>
        ${password}
      </p>

      <p>
        After your first login,
        you will be required to
        change your password.
      </p>

    </div>
  `,
});

    return NextResponse.json({
      success: true,

      message:
        "Staff created successfully",

      staff,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create staff",
      },
      {
        status: 500,
      }
    );
  }
}