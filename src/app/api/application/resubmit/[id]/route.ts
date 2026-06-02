import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";


import dbConnect from "@/lib/dbConnect";

import ApplicationModel from "@/models/application";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function PUT(
request: NextRequest,
{ params }: { params: Promise<{ id: string }> }
) {
try {
await dbConnect();
    

const session =
  await getServerSession(authOptions);

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

const { id: applicationId } =
  await params;

const body = await request.json();

const application =
  await ApplicationModel.findById(
    applicationId
  );

if (!application) {
  return NextResponse.json(
    {
      success: false,
      message: "Application not found",
    },
    {
      status: 404,
    }
  );
}


if (
  application.userId.toString() !==
  session.user.id
) {
  return NextResponse.json(
    {
      success: false,
      message:
        "You are not allowed to edit this application",
    },
    {
      status: 403,
    }
  );
}

if (
  application.status !== "rejected"
) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Only rejected applications can be resubmitted",
    },
    {
      status: 400,
    }
  );
}

application.phone =
  body.phone;

application.address =
  body.address;

application.district =
  body.district;

application.pinCode =
  body.pinCode;

application.gender =
  body.gender;

application.dateOfBirth =
  new Date(
    body.dateOfBirth
  );

application.aadharNumber =
  body.aadharNumber;

application.photoUrl =
  body.photoUrl;

application.signatureUrl =
  body.signatureUrl;

application.aadharDocumentUrl =
  body.aadharDocumentUrl;

/*
  Reset workflow
*/

application.status =
  "pending";

application.rejectionReason =
  "";

application.rejectedBy =
  undefined;

application.rejectedAt =
  undefined;

  console.log(
  "Resubmitting application:",
  applicationId
);

await application.save();
console.log(
  "Application saved successfully"
);

return NextResponse.json(
  {
    success: true,
    message:
      "Application resubmitted successfully",
    application,
  },
  {
    status: 200,
  }
);


} catch (error) {
console.error(
"RESUBMIT ERROR:",
error
);


return NextResponse.json(
  {
    success: false,
    message:
      "Something went wrong",
  },
  {
    status: 500,
  }
);


}
}
