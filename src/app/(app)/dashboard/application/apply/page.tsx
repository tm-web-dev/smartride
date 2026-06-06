"use client";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState, useEffect } from "react";
import { Loader2, UploadCloud, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Clean separation of concerns: importing your standalone schema
import {
  applicationSchema,
  ApplicationFormType,
} from "@/schema/applicationSchema";

export default function ApplyPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);
  const [uploadingAadhar, setUploadingAadhar] = useState(false);
  const [
  applicationsEnabled,
  setApplicationsEnabled,
] = useState(true);

const [
  applicationDisabledMessage,
  setApplicationDisabledMessage,
] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormType>({
    resolver: zodResolver(applicationSchema),
  });

  const photoUrl = watch("photoUrl");
  const signatureUrl = watch("signatureUrl");
  const aadharDocumentUrl = watch("aadharDocumentUrl");

  

  // Sync disabled profile details directly from auth context session safely
  useEffect(() => {
    if (session?.user?.name)
      setValue("fullName", session.user.name, { shouldValidate: true });
    if (session?.user?.email)
      setValue("email", session.user.email, { shouldValidate: true });
  }, [session, setValue]);
const router = useRouter();

useEffect(() => {
  const checkSettings = async () => {
    try {
      const res = await axios.get(
        "/api/settings/public"
      );

      if (
        !res.data.applicationsEnabled
      ) {
        toast.error(
          res.data.applicationDisabledMessage ||
            "Applications are currently closed."
        );

        router.replace(
          "/dashboard"
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  checkSettings();
}, [router]);
  // Reset payment access state if user updates fields after draft confirmation
  const basicFields = watch([
    "phone",
    "address",
    "district",
    "pinCode",
    "aadharNumber",
    "dateOfBirth",
  ]);
  useEffect(() => {
    if (isDraftSaved) {
      setIsDraftSaved(false);
    }
  }, [basicFields.join("-")]);

  const uploadFile = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await axios.post("/api/upload", formData);
    return response.data.url;
  };

  const onSaveDraft = async (data: ApplicationFormType) => {
    try {
      setLoading(true);

      const response = await axios.post("/api/application/apply", {
        ...data,
        status: "draft",
      });

      console.log("SAVE RESPONSE:", response.data);

      if (response.data?.success) {
        const applicationId =
          response.data.applicationId ||
          response.data.application?._id ||
          response.data.data?._id ||
          response.data._id;

        console.log("APPLICATION ID:", applicationId);

        if (!applicationId) {
          alert("Application ID not returned from API");
          return;
        }

        setApplicationId(applicationId);

        setIsDraftSaved(true);

        toast.success(
  "Draft Saved Successfully",
  {
    description:
      "Your application draft has been saved. You can now proceed to payment.",
  }
);
      }
    } catch (error) {
      console.error(error);

      toast.error(
  "Failed To Save Draft",
  {
    description:
      "Something went wrong while saving your application.",
  }
);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    console.log("Draft Saved:", isDraftSaved);

    console.log("Application ID:", applicationId);

    if (!applicationId) {
      alert("Please save draft first.");
      return;
    }

    window.location.href = `/dashboard/application/payment/${applicationId}`;
  };

  return (
    <div className="w-full min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-card border rounded-[32px] shadow-sm overflow-hidden my-4">
        {/* HEADER */}
        <div className="border-b px-6 md:px-16 py-10 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-card-foreground">
            Bus Concession Application
          </h1>
          <p className="text-muted-foreground mt-3 text-[15px] leading-7">
            Fill in all details carefully, upload files, and save your draft to
            unlock checkout payments.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSaveDraft)}
          className="p-6 md:p-16 space-y-16"
        >
          {/* Hidden inputs to pass required background schema keys to onSubmit */}
          <input type="hidden" {...register("fullName")} />
          <input type="hidden" {...register("email")} />
          <input type="hidden" {...register("photoUrl")} />
          <input type="hidden" {...register("signatureUrl")} />
          <input type="hidden" {...register("aadharDocumentUrl")} />

          {/* PERSONAL INFO */}
          <section className="space-y-12">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-card-foreground">
                Personal Information
              </h2>
              <p className="text-muted-foreground text-sm">
                Enter your personal and address details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <Label className="text-sm font-medium pl-1">Full Name</Label>
                <Input
                  disabled
                  value={session?.user?.name || ""}
                  className="h-13 px-5 text-[15px] rounded-2xl bg-muted text-muted-foreground"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 pl-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-medium pl-1">
                  Email Address
                </Label>
                <Input
                  disabled
                  value={session?.user?.email || ""}
                  className="h-13 px-5 text-[15px] rounded-2xl bg-muted text-muted-foreground"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 pl-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <Label className="text-sm font-medium pl-1">Phone Number</Label>
                <Input
                  {...register("phone")}
                  placeholder="Enter phone number"
                  className="h-13 px-5 text-[15px] rounded-2xl"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 pl-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-4 relative z-50">
                <Label className="text-sm font-medium pl-1">Gender</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("gender", value as any, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="w-full h-13 px-5 rounded-2xl text-[15px] bg-background border border-input text-left flex items-center justify-between">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="w-full rounded-2xl bg-popover text-popover-foreground shadow-md border z-100 mt-1"
                  >
                    <SelectItem
                      value="male"
                      className="cursor-pointer py-2.5 px-4 rounded-xl focus:bg-accent focus:text-accent-foreground"
                    >
                      Male
                    </SelectItem>
                    <SelectItem
                      value="female"
                      className="cursor-pointer py-2.5 px-4 rounded-xl focus:bg-accent focus:text-accent-foreground"
                    >
                      Female
                    </SelectItem>
                    <SelectItem
                      value="other"
                      className="cursor-pointer py-2.5 px-4 rounded-xl focus:bg-accent focus:text-accent-foreground"
                    >
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500 pl-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium pl-1">Address</Label>
              <Textarea
                {...register("address")}
                placeholder="Enter complete address"
                className="min-h-35 rounded-2xl px-5 py-4 text-[15px] leading-relaxed"
              />
              {errors.address && (
                <p className="text-sm text-red-500 pl-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <Label className="text-sm font-medium pl-1">District</Label>
                <Input
                  {...register("district")}
                  placeholder="Enter district"
                  className="h-13 px-5 text-[15px] rounded-2xl"
                />
                {errors.district && (
                  <p className="text-sm text-red-500 pl-1">
                    {errors.district.message}
                  </p>
                )}
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-medium pl-1">PIN Code</Label>
                <Input
                  {...register("pinCode")}
                  placeholder="Enter PIN code"
                  className="h-13 px-5 text-[15px] rounded-2xl"
                />
                {errors.pinCode && (
                  <p className="text-sm text-red-500 pl-1">
                    {errors.pinCode.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <Label className="text-sm font-medium pl-1">
                  Date of Birth
                </Label>
                <Input
                  type="date"
                  {...register("dateOfBirth")}
                  className="h-13 px-5 text-[15px] rounded-2xl"
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500 pl-1">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-medium pl-1">
                  Aadhaar Number
                </Label>
                <Input
                  {...register("aadharNumber")}
                  placeholder="Enter Aadhaar number"
                  className="h-13 px-5 text-[15px] rounded-2xl"
                />
                {errors.aadharNumber && (
                  <p className="text-sm text-red-500 pl-1">
                    {errors.aadharNumber.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* DOCUMENTS */}
          <section className="space-y-12 border-t pt-14">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-card-foreground">
                Upload Documents
              </h2>
              <p className="text-muted-foreground text-sm">
                Upload files directly to secure cloud storage.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* PHOTO */}
              <div
                className={`rounded-3xl border p-8 space-y-8 flex flex-col justify-between ${photoUrl ? "border-green-500 bg-green-50/10" : "bg-muted/20"}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl shrink-0 ${photoUrl ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"}`}
                  >
                    {photoUrl ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <UploadCloud size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">Passport Photo</h3>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      JPG or PNG
                    </p>
                  </div>
                </div>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={uploadingPhoto}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setUploadingPhoto(true);
                        const url = await uploadFile(
                          file,
                          "applications/photos",
                        );
                        setValue("photoUrl", url, { shouldValidate: true });
                      } catch (error) {
                        alert("Photo upload failed");
                      } finally {
                        setUploadingPhoto(false);
                      }
                    }}
                    className="h-12 rounded-xl cursor-pointer"
                  />
                  {errors.photoUrl && (
                    <p className="text-xs text-red-500 mt-2 pl-1">
                      {errors.photoUrl.message}
                    </p>
                  )}
                </div>
              </div>

              {/* SIGNATURE */}
              <div
                className={`rounded-3xl border p-8 space-y-8 flex flex-col justify-between ${signatureUrl ? "border-green-500 bg-green-50/10" : "bg-muted/20"}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl shrink-0 ${signatureUrl ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"}`}
                  >
                    {signatureUrl ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <UploadCloud size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">Signature</h3>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Clear image file
                    </p>
                  </div>
                </div>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={uploadingSignature}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setUploadingSignature(true);
                        const url = await uploadFile(
                          file,
                          "applications/signatures",
                        );
                        setValue("signatureUrl", url, { shouldValidate: true });
                      } catch (error) {
                        alert("Signature upload failed");
                      } finally {
                        setUploadingSignature(false);
                      }
                    }}
                    className="h-12 rounded-xl cursor-pointer"
                  />
                  {errors.signatureUrl && (
                    <p className="text-xs text-red-500 mt-2 pl-1">
                      {errors.signatureUrl.message}
                    </p>
                  )}
                </div>
              </div>

              {/* AADHAAR */}
              <div
                className={`rounded-3xl border p-8 space-y-8 flex flex-col justify-between ${aadharDocumentUrl ? "border-green-500 bg-green-50/10" : "bg-muted/20"}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl shrink-0 ${aadharDocumentUrl ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"}`}
                  >
                    {aadharDocumentUrl ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <UploadCloud size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">
                      Aadhaar Document
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      PDF or image
                    </p>
                  </div>
                </div>
                <div>
                  <Input
                    type="file"
                    accept=".pdf,image/*"
                    disabled={uploadingAadhar}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setUploadingAadhar(true);
                        const url = await uploadFile(
                          file,
                          "applications/aadhar",
                        );
                        setValue("aadharDocumentUrl", url, {
                          shouldValidate: true,
                        });
                      } catch (error) {
                        alert("Aadhar upload failed");
                      } finally {
                        setUploadingAadhar(false);
                      }
                    }}
                    className="h-12 rounded-xl cursor-pointer"
                  />
                  {errors.aadharDocumentUrl && (
                    <p className="text-xs text-red-500 mt-2 pl-1">
                      {errors.aadharDocumentUrl.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER ACTION PANEL */}
          <div className="border-t pt-12 flex flex-col md:flex-row gap-8 md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="font-semibold text-xl">Save your application</p>
              <p className="text-sm text-muted-foreground">
                {!isDraftSaved
                  ? "You must save your form draft before proceeding to checkout."
                  : "Draft linked successfully. Ready to make a payment."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              {/* BUTTON 1: SAVE DRAFT */}
              <Button
                type="submit"
                disabled={
                  loading ||
                  uploadingPhoto ||
                  uploadingSignature ||
                  uploadingAadhar
                }
                className="h-13 px-8 rounded-2xl text-[15px] font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                {loading && !isDraftSaved ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    Saving...
                  </span>
                ) : (
                  "Save Draft"
                )}
              </Button>

              {/* BUTTON 2: PROCEED TO PAYMENT */}
              <Button
                type="button"
                onClick={handleProceedToPayment}
                disabled={!isDraftSaved || loading}
                className="h-13 px-10 rounded-2xl min-w-55 text-[15px] font-medium transition-all duration-300 disabled:opacity-40 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              >
                {loading && isDraftSaved ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Redirecting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    Proceed to Payment <ArrowRight size={16} />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
