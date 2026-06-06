import ChangePasswordForm from "@/components/auth/ChangePasswordForm";

export default function AdminChangePasswordPage() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Change Password
        </h1>

        <p className="text-muted-foreground">
          Update your administrator password
        </p>
      </div>

      <ChangePasswordForm />

    </div>
  );
}