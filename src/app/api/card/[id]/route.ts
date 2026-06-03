import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

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
    const { id } = await params;

    const browser =
      await puppeteer.launch({
        headless: true,
      });

    const page =
      await browser.newPage();

    await page.goto(
      `${process.env.NEXTAUTH_URL}/card-template/${id}`,
      {
        waitUntil:
          "networkidle0",
      }
    );


    const pdf =
      await page.pdf({
        format: "A4",
        printBackground: true,
        landscape: true,
      });

    await browser.close();

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type":
          "application/pdf",

        "Content-Disposition":
          `inline; filename=SmartRide-Card.pdf`,
      },
    });
  } catch (error) {
    console.error(error);

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