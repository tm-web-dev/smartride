import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/models/application";

import SmartRideCard from "@/components/card/SmartRideCard";

export default async function CardTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await dbConnect();

  const { id } = await params;

  const application =
    await ApplicationModel.findById(id).lean();

  if (!application) {
    return (
      <div className="p-10">
        Application not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-10">
      <SmartRideCard
        application={JSON.parse(
          JSON.stringify(application)
        )}
      />
    </div>
  );
}