import { FarmerRegistrationForm } from "@/components/forms/farmer-registration-form";
import { PageHeader } from "@/components/shared/page-header";
import { Users } from "lucide-react";

export default function NewFarmerPage() {
  return (
    <>
      <PageHeader
        title="Register New Farmer"
        icon={Users}
        description="Add a new farmer to the DairyConnect system."
      />
      <FarmerRegistrationForm />
    </>
  );
}
