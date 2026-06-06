import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/models/application";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await dbConnect();

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { id } =
      await params;

    const application =
      await ApplicationModel.findById(
        id
      );

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Application not found",
        },
        {
          status: 404,
        }
      );
    }

    const isOwner =
      application.userId?.toString() ===
      session.user.id;

    const isStaff =
      session.user.role ===
        "staff" ||
      session.user.role ===
        "admin";

    if (
      !isOwner &&
      !isStaff
    ) {
      return NextResponse.redirect(
        new URL(
          "/unauthorized",
          request.url
        )
      );
    }

    const cardUrl = `${process.env.NEXTAUTH_URL}/print/card-template/${id}`;

    console.log(
      "Generating Card PDF:",
      cardUrl
    );

    const browser =
      await puppeteer.launch({
        args: chromium.args,

        executablePath:
          await chromium.executablePath(),

        headless: true,
      });

    const page =
      await browser.newPage();

    await page.goto(
      cardUrl,
      {
        waitUntil:
          "networkidle0",

        timeout: 60000,
      }
    );

    await page.addStyleTag({
      content: `
        nav,
        footer,
        header {
          display: none !important;
        }

        body {
          margin: 0 !important;
          padding: 0 !important;
        }
      `,
    });

    const pdf =
      await page.pdf({
        format: "A4",

        landscape: true,

        printBackground: true,
      });

    await browser.close();

    return new NextResponse(
      Buffer.from(pdf),
      {
        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `inline; filename=SmartRide-${application.applicationNumber}.pdf`,
        },
      }
    );
  } catch (error) {
    console.error(
      "CARD_PDF_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to generate PDF",
      },
      {
        status: 500,
      }
    );
  }
}