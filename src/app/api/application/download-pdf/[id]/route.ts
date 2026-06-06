import connectDB from "@/lib/dbConnect";

import ApplicationModel from "@/models/application";

import puppeteer from "puppeteer-core";

import chromium from "@sparticuz/chromium";

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
    await connectDB();

    const { id } =
      await params;

    const application =
      await ApplicationModel.findById(
        id
      );

    if (!application) {
      return Response.json(
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

    const receiptUrl = `${process.env.NEXTAUTH_URL}/receipt/${id}`;

    console.log(
      "Generating PDF:",
      receiptUrl
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
      receiptUrl,
      {
        waitUntil:
          "networkidle0",

        timeout: 60000,
      }
    );

    const pdf =
      await page.pdf({
        format: "A4",

        printBackground: true,
      });

    await browser.close();

    return new Response(
      Buffer.from(pdf),
      {
        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename=SmartRide-${application.applicationNumber}.pdf`,
        },
      }
    );
  } catch (error) {
    console.error(
      "PDF_GENERATION_ERROR:",
      error
    );

    return Response.json(
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