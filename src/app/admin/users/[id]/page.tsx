"use client";

import axios from "axios";

import {
  useEffect,
  useState,
} from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function UserPage({
  params,
}: Props) {
  const [user, setUser] =
    useState<any>(null);

  const [
    latestApplication,
    setLatestApplication,
  ] = useState<any>(null);

  const [
    applications,
    setApplications,
  ] = useState<any[]>([]);

  useEffect(() => {
    const fetchUser =
      async () => {
        const { id } =
          await params;

        const res =
          await axios.get(
            `/api/admin/users/${id}`
          );

        setUser(
          res.data.user
        );

        setLatestApplication(
          res.data
            .latestApplication
        );

        setApplications(
          res.data.applications
        );
      };

    fetchUser();
  }, [params]);

  if (!user) {
    return (
      <div className="flex justify-center py-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          {user.name}
        </h1>

        <p className="text-muted-foreground">
          {user.email}
        </p>
      </div>

      {/* User Info */}
      <div className="border rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-4">
          User Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <p>
            <strong>Role:</strong>{" "}
            {user.role}
          </p>

          <p>
            <strong>Verified:</strong>{" "}
            {user.isVerified
              ? "Yes"
              : "No"}
          </p>

          <p>
            <strong>Joined:</strong>{" "}
            {new Date(
              user.createdAt
            ).toLocaleDateString()}
          </p>

          <p>
            <strong>Total Applications:</strong>{" "}
            {applications.length}
          </p>

        </div>

      </div>

      {/* Application Details */}
      {latestApplication && (
        <>
          <div className="border rounded-xl p-6">

            <h2 className="text-xl font-semibold mb-4">
              Application Details
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <p>
                <strong>
                  Application Number:
                </strong>{" "}
                {
                  latestApplication.applicationNumber
                }
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {
                  latestApplication.status
                }
              </p>

              <p>
                <strong>
                  Payment Status:
                </strong>{" "}
                {
                  latestApplication.paymentStatus
                }
              </p>

              <p>
                <strong>
                  Application Fee:
                </strong>{" "}
                ₹
                {
                  latestApplication.applicationFee
                }
              </p>

              <p>
                <strong>
                  Payment Date:
                </strong>{" "}
                {latestApplication.paymentDate
                  ? new Date(
                      latestApplication.paymentDate
                    ).toLocaleDateString()
                  : "-"}
              </p>

              <p>
                <strong>
                  Valid Till:
                </strong>{" "}
                {latestApplication.validTill
                  ? new Date(
                      latestApplication.validTill
                    ).toLocaleDateString()
                  : "-"}
              </p>

            </div>

          </div>

          {/* Personal Info */}
          <div className="border rounded-xl p-6">

            <h2 className="text-xl font-semibold mb-4">
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <p>
                <strong>Phone:</strong>{" "}
                {
                  latestApplication.phone
                }
              </p>

              <p>
                <strong>Gender:</strong>{" "}
                {
                  latestApplication.gender
                }
              </p>

              <p>
                <strong>DOB:</strong>{" "}
                {new Date(
                  latestApplication.dateOfBirth
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Aadhaar:</strong>{" "}
                {
                  latestApplication.aadharNumber
                }
              </p>

            </div>

          </div>

          {/* Address */}
          <div className="border rounded-xl p-6">

            <h2 className="text-xl font-semibold mb-4">
              Address Information
            </h2>

            <div className="space-y-2">

              <p>
                <strong>
                  Address:
                </strong>{" "}
                {
                  latestApplication.address
                }
              </p>

              <p>
                <strong>
                  District:
                </strong>{" "}
                {
                  latestApplication.district
                }
              </p>

              <p>
                <strong>
                  PIN Code:
                </strong>{" "}
                {
                  latestApplication.pinCode
                }
              </p>

            </div>

          </div>

          {/* Documents */}
          <div className="border rounded-xl p-6">

            <h2 className="text-xl font-semibold mb-6">
              Uploaded Documents
            </h2>

            <div className="grid md:grid-cols-2 gap-8">

              <div>
                <p className="font-medium mb-3">
                  Passport Photo
                </p>

                <img
                  src={
                    latestApplication.photoUrl
                  }
                  alt="Photo"
                  className="
                    w-56
                    h-56
                    object-cover
                    border
                    rounded-xl
                  "
                />
              </div>

              <div>
                <p className="font-medium mb-3">
                  Signature
                </p>

                <img
                  src={
                    latestApplication.signatureUrl
                  }
                  alt="Signature"
                  className="
                    w-56
                    h-32
                    object-contain
                    bg-white
                    border
                    rounded-xl
                  "
                />
              </div>

            </div>

            <div className="mt-8">

              <a
                href={
                  latestApplication.aadharDocumentUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  px-4
                  py-2
                  rounded-lg
                  bg-primary
                  text-primary-foreground
                "
              >
                View Aadhaar Document
              </a>

            </div>

          </div>
        </>
      )}

      {/* History */}
      <div className="border rounded-xl">

        <div className="p-4 border-b font-semibold">
          Application History
        </div>

        <table className="w-full">

          <thead>

            <tr>

              <th className="p-4 text-left">
                Number
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Payment
              </th>

              <th className="p-4 text-left">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {applications.map(
              (app: any) => (
                <tr
                  key={app._id}
                  className="border-t"
                >
                  <td className="p-4">
                    {
                      app.applicationNumber
                    }
                  </td>

                  <td className="p-4 capitalize">
                    {app.status}
                  </td>

                  <td className="p-4 capitalize">
                    {
                      app.paymentStatus
                    }
                  </td>

                  <td className="p-4">
                    {new Date(
                      app.createdAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}