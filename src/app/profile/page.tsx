"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ProfileHeader from "@/components/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DumbbellIcon, LocationEditIcon } from "lucide-react";
import Link from "next/link";

const ProfilePage = () => {
  const { user } = useUser();
  const userId = user?.id as string;

  const allPlans = useQuery(api.plans.getUserPlans, { userId });

  if (!allPlans) {
    return <div>Loading...</div>;
  }

  if (allPlans.length === 0) {
    return <div>No plans found.</div>;
  }

  return (
    <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4">
      <ProfileHeader user={user} />

      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="mb-6 w-full grid grid-cols-1 bg-cyber-terminal-bg border">
          <TabsTrigger
            value="workout"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <DumbbellIcon className="mr-2 size-4" />
            Solar Generated Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workout">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <LocationEditIcon className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm text-muted-foreground">
                <button className="border p-2  hover:bg-amber-600 rounded-4xl text-amber-50">
                  <Link href="/locationEntry">Change Location</Link>
                </button>
              </span>
            </div>

            {allPlans.map((plan) => (
              <div
                key={plan._id}
                className="border border-border bg-black rounded-lg shadow p-6 space-y-2"
              >
                <div className="grid grid-cols-1  gap-8 text-sm ">
                  <div className="border  p-3 rounded-xl  text-lg gap-2  font-light">
                    <strong className="text-orange-500">Location :</strong>{" "}
                    {plan.location}
                  </div>
                  <div className="border p-3 rounded-xl  text-lg gap-2  font-light">
                    <strong className="text-orange-500">Capacity:</strong>{" "}
                    {plan.recommended_capacity_kw} kW
                  </div>
                  <div className="border p-3 rounded-xl  text-lg gap-2  font-light">
                    <strong className="text-orange-500">Panel Type:</strong>{" "}
                    {plan.solar_panel_type}
                  </div>
                  <div className="border p-3 rounded-xl  text-lg gap-2  font-light">
                    <strong className="text-orange-500">Total Panels:</strong>{" "}
                    {plan.total_solar_panel}
                  </div>
                  <div className="border p-3 rounded-xl  text-lg gap-2  font-light">
                    <strong className="text-orange-500">Panel Rating:</strong>{" "}
                    {plan.panel_rating} W
                  </div>
                  <div className="border p-3 rounded-xl  text-lg gap-2  font-light">
                    <strong className="text-orange-500">Required Area:</strong>{" "}
                    {plan.required_area_sq_m} m²
                  </div>
                  <div className="border p-3 rounded-xl  text-lg gap-2  font-light">
                    <strong className="text-orange-500">
                      Monthly Generation:
                    </strong>{" "}
                    {plan.estimated_monthly_generation_kwh} kWh
                  </div>
                  <div className="border p-3 rounded-xl  text-lg gap-2  font-light">
                    <strong className="text-orange-500">
                      Monthly Savings:
                    </strong>{" "}
                    ₹{plan.estimated_monthly_savings_inr}
                  </div>
                  <div className="border p-3 rounded-xl  text-lg gap-2  font-light">
                    <strong className="text-orange-500">Estimated Cost:</strong>{" "}
                    ₹{plan.estimated_cost_inr}
                  </div>
                  <div className="border p-3 rounded-xl  text-lg gap-2  font-light">
                    <strong className="text-orange-500">Payback Period:</strong>{" "}
                    {plan.payback_period_years} years
                  </div>
                  <div className="border p-3 rounded-xl  text-lg gap-2  font-light">
                    <strong className="text-orange-500">Maintenance:</strong>{" "}
                    {plan.maintenance_advice}
                  </div>
                  <div className="border p-3 rounded-xl  text-lg gap-2  font-light">
                    <strong className="text-orange-500">Status:</strong>{" "}
                    {plan.isActive ? "Active" : "Inactive"}
                  </div>
                  <div className="border p-3 rounded-xl  text-lg gap-2  font-light">
                    <strong className="text-orange-500">Notes:</strong>{" "}
                    {plan.notes || "None"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};
export default ProfilePage;
