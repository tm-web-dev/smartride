import { Resend } from "resend";

const resend = new Resend(
  process.env.RESENDER_API_KEY
);

interface EmailProps {
  email: string;
  fullName: string;
  applicationNumber: string;
  status:
    | "approved"
    | "rejected"
    | "printed"
    | "dispatched"
    | "delivered"
    | "pending";

  rejectionReason?: string;
}

export async function sendStatusEmail({
  email,
  fullName,
  applicationNumber,
  status,
  rejectionReason,
}: EmailProps) {
  let subject = "";
  let html = "";

  switch (status) {
    case "approved":
      subject =
        "SmartRide Application Approved";

      html = `
        <h2>Application Approved</h2>

        <p>Dear ${fullName},</p>

        <p>
          We are pleased to inform you that your SmartRide Bus Concession Card application has been approved.
        </p>

        <p>
          <strong>Application Number:</strong> ${applicationNumber}
        </p>

        <p>
          Your concession card is now being prepared for printing.
        </p>

        <p>
          You can track the latest status of your application by logging in to your SmartRide dashboard.
        </p>

        <br />

        <p>Regards,</p>
        <p><strong>SmartRide Support Team</strong></p>
      `;
      break;

    case "rejected":
      subject =
        "SmartRide Application Requires Correction";

      html = `
        <h2>Application Requires Correction</h2>

        <p>Dear ${fullName},</p>

        <p>
          After reviewing your application, we found that some information or documents require correction before approval can be granted.
        </p>

        <p>
          <strong>Application Number:</strong> ${applicationNumber}
        </p>

        <p>
          <strong>Reason:</strong><br />
          ${rejectionReason || "No reason provided"}
        </p>

        <p>
          You may edit and resubmit your application without making another payment.
        </p>

        <p>
          Please log in to your SmartRide dashboard to review the remarks and submit the corrected application.
        </p>

        <br />

        <p>Regards,</p>
        <p><strong>SmartRide Support Team</strong></p>
      `;
      break;

    case "printed":
      subject =
        "SmartRide Card Printed Successfully";

      html = `
        <h2>Card Printed Successfully</h2>

        <p>Dear ${fullName},</p>

        <p>
          Your SmartRide Bus Concession Card has been printed successfully.
        </p>

        <p>
          <strong>Application Number:</strong> ${applicationNumber}
        </p>

        <p>
          The card is now awaiting dispatch and will be sent shortly.
        </p>

        <p>
          You can track the latest status through your SmartRide dashboard.
        </p>

        <br />

        <p>Regards,</p>
        <p><strong>SmartRide Support Team</strong></p>
      `;
      break;

    case "dispatched":
      subject =
        "SmartRide Card Dispatched";

      html = `
        <h2>Card Dispatched</h2>

        <p>Dear ${fullName},</p>

        <p>
          Your SmartRide Bus Concession Card has been dispatched.
        </p>

        <p>
          <strong>Application Number:</strong> ${applicationNumber}
        </p>

        <p>
          Please expect delivery soon.
        </p>

        <p>
          You can monitor the current status from your SmartRide dashboard.
        </p>

        <br />

        <p>Regards,</p>
        <p><strong>SmartRide Support Team</strong></p>
      `;
      break;

    case "delivered":
      subject =
        "SmartRide Card Delivered";

      html = `
        <h2>Card Delivered</h2>

        <p>Dear ${fullName},</p>

        <p>
          Your SmartRide Bus Concession Card has been marked as delivered.
        </p>

        <p>
          <strong>Application Number:</strong> ${applicationNumber}
        </p>

        <p>
          Thank you for using SmartRide.
        </p>

        <p>
          You may continue to access your application details and card status through your SmartRide dashboard.
        </p>

        <br />

        <p>Regards,</p>
        <p><strong>SmartRide Support Team</strong></p>
      `;
      break;

    default:
      return;
  }

  const result =
    await resend.emails.send({
      from:
        "SmartRide <no-reply@crewofficials.com>",
      to: email,
      subject,
      html,
    });

  console.log(
    "Status Email Sent:",
    result
  );

  return result;
}