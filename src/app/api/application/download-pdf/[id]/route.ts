import connectDB from "@/lib/dbConnect";
import ApplicationModel from "@/models/application";
import puppeteer from "puppeteer";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  await connectDB();

  const { id } = await params;

  const application =
    await ApplicationModel.findById(id);

  if (!application) {
    return Response.json(
      {
        success: false,
        message:
          "Application not found",
      },
      { status: 404 }
    );
  }

  const browser =
    await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

  const page =
    await browser.newPage();

  await page.goto(
    `${process.env.NEXTAUTH_URL}/receipt/${id}`,
    {
      waitUntil: "networkidle0",
    }
  );

  const pdf =
  await page.pdf({
    format: "A4",
    printBackground: true,
  });

await browser.close();

const pdfBuffer =
  Buffer.from(pdf);

return new Response(
  pdfBuffer,
  {
    headers: {
      "Content-Type":
        "application/pdf",

      "Content-Disposition":
        `attachment; filename=SmartRide-${application.applicationNumber}.pdf`,
    },
  }
);
}