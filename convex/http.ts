import { httpRouter } from "convex/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useQuery } from "convex/react";

const http = httpRouter();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type WeatherData = {
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    relative_humidity_2m_min: number[] | null;
    windspeed_10m_max: number[];
    shortwave_radiation_sum: number[];
  };
};
type MonthlyAverage = {
  min_temperature: number;
  max_temperature: number;
  average_humidity: number | null;
  average_windspeed: number;
  average_radiation: number;
};


http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("No svix headers found", {
        status: 400,
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, first_name, last_name, image_url, email_addresses } = evt.data;

      const email = email_addresses[0].email_address;

      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.syncUser, {
          email,
          name,
          image: image_url,
          clerkId: id,
        });
      } catch (error) {
        console.log("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    if (eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.updateUser, {
          clerkId: id,
          email,
          name,
          image: image_url,
        });
      } catch (error) {
        console.log("Error updating user:", error);
        return new Response("Error updating user", { status: 500 });
      }
    }

    return new Response("Webhooks processed successfully", { status: 200 });
  }),
});

function validateSolarPlan(plan: any) {
  const validatedPlan = {
    userId: typeof plan.userId === "string" ? plan.userId : "demo-user-id",
    recommended_capacity_kw: typeof plan.recommended_capacity_kw === "number" ? plan.recommended_capacity_kw : parseFloat(plan.recommended_capacity_kw) || 1,
    total_solar_panel: typeof plan.total_solar_panel === "number" ? plan.total_solar_panel : parseInt(plan.total_solar_panel) || 1,
    panel_rating: typeof plan.panel_rating === "number" ? plan.panel_rating : parseFloat(plan.panel_rating) || 300,
    tilt_angle: typeof plan.tilt_angle === "number" ? plan.tilt_angle : parseFloat(plan.tilt_angle) || 20,
    solar_panel_type: typeof plan.solar_panel_type === "string" ? plan.solar_panel_type : "Monocrystalline",
    location: typeof plan.location === "string" ? plan.location : "Unknown Location",
    required_area_sq_m: typeof plan.required_area_sq_m === "number" ? plan.required_area_sq_m : parseFloat(plan.required_area_sq_m) || 10,
    estimated_monthly_generation_kwh: typeof plan.estimated_monthly_generation_kwh === "number" ? plan.estimated_monthly_generation_kwh : parseFloat(plan.estimated_monthly_generation_kwh) || 100,
    estimated_monthly_savings_inr: typeof plan.estimated_monthly_savings_inr === "number" ? plan.estimated_monthly_savings_inr : parseFloat(plan.estimated_monthly_savings_inr) || 1000,
    estimated_cost_inr: typeof plan.estimated_cost_inr === "number" ? plan.estimated_cost_inr : parseFloat(plan.estimated_cost_inr) || 100000,
    payback_period_years: typeof plan.payback_period_years === "number" ? plan.payback_period_years : parseFloat(plan.payback_period_years) || 5,
    maintenance_advice: typeof plan.maintenance_advice === "string" ? plan.maintenance_advice : "Clean panels regularly.",
    notes: typeof plan.notes === "string" ? plan.notes : undefined, // notes are optional
  };
  
  return validatedPlan;
}

http.route({
  path: "/vapi/generate-program",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      
      const payload = await request.json();
      

      const {
        units_consumed,
        shade,
        weather_condition,
        snow_cover,
        total_ele_load,
        user_id,
      } = payload;

      const weather = await ctx.runMutation(api.plans.getWeather, { userId: user_id });

      if (weather == null) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Weather data not found for the given user ID.",
          }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
      

      console.log("Payload is here:", payload);
      console.log("Weather is here:", weather)


      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-001", // Specify the model
        generationConfig: {
          temperature: 0.4, // Lower temperature for more predictable outputs
          topP: 0.9, // Control diversity of the output
          responseMimeType: "application/json", // Expecting a JSON response
        },
      });
      
      

      const workoutPrompt = `You are a solar energy consultant generating a personalized solar panel recommendation using the following data:

- Monthly electricity units consumed: ${units_consumed}
- Shade condition on the roof: ${shade}
- Local weather condition (dust/pollution): ${weather_condition}
- Snow or heavy rain months per year: ${snow_cover}
- Total electrical load of the house: ${total_ele_load}
- Weather data of each month starting from january(month-0) to December(month-12): ${weather.monthly_data}
- User Complete Adress: ${weather.userLocation}


TASKS:
1. Estimate the recommended solar capacity (in kW)
2. Suggest the number of solar panels, their wattage, and required roof area (in sq.m)
3. Recommend tilt angle based on location for optimal solar capture and title angle must be between 20 and 30
4. Recommend the best panel type (e.g., monocrystalline or polycrystalline)
5. Estimate monthly power generation (in kWh) and savings (in ₹ or $)
6. Estimate system cost based on panel type and capacity
7. Calculate approximate payback period
8. Give maintenance advice (based on pollution/dust/shade)
9. Include extra notes (e.g., use of microinverters or special mounting if needed)

CRITICAL SCHEMA INSTRUCTIONS:
- Output MUST contain ONLY the fields shown below
- All numerical fields should be raw numbers, NOT strings or descriptive text
- Estimated cost should be in ₹ (INR)
- Do not add text outside the JSON structure
- Include daily peak sunlight hours (average from radiation) in calculations
- Shade duration (hours) should directly impact estimated generation
- System loss factors (dust, heat, shading, wiring) must be considered 
- Monthly generation must vary seasonally based on radiation + rain + shading
- Panel lifetime = 25 years; inverter = 10 years
- If estimated generation > 150% of consumption, reduce system size


Return a JSON object like this:
{
  "recommended_capacity_kw": 3.5,
  "total_solar_panel": 10,
  "panel_rating": 350,
  "tilt_angle": 23,
  "solar_panel_type": "Monocrystalline",
  "location": "SAVARKAR COLONY VISHRAMBAG SANGLI",
  "required_area_sq_m": 20,
  "estimated_monthly_generation_kwh": 420,
  "estimated_monthly_savings_inr": 2500,
  "estimated_cost_inr": 210000,
  "payback_period_years": 5.2,
  "maintenance_advice": "Clean panels once every 2 weeks due to moderate dust levels.",
  "notes": "Partial shading detected, recommend microinverters for optimized performance."
}

DO NOT include any other text outside of this JSON object.`;


      const workoutResult = await model.generateContent(workoutPrompt);
      const workoutPlanText = workoutResult.response.text();

      let aiGeneratedPlan = JSON.parse(workoutPlanText);
      aiGeneratedPlan = validateSolarPlan(aiGeneratedPlan);
      console.log("gemini replied" ,aiGeneratedPlan)

  
      const planId = await ctx.runMutation(api.plans.createPlan, {
        userId : user_id, // Replace as needed
        recommended_capacity_kw: aiGeneratedPlan.recommended_capacity_kw,
        total_solar_panel: aiGeneratedPlan.total_solar_panel, // already corrected name
        panel_rating: aiGeneratedPlan.panel_rating,
        tilt_angle: aiGeneratedPlan.tilt_angle,
        solar_panel_type: aiGeneratedPlan.solar_panel_type,
        location: aiGeneratedPlan.location,
        required_area_sq_m: aiGeneratedPlan.required_area_sq_m,
        estimated_monthly_generation_kwh: aiGeneratedPlan.estimated_monthly_generation_kwh,
        estimated_monthly_savings_inr: aiGeneratedPlan.estimated_monthly_savings_inr,
        estimated_cost_inr: aiGeneratedPlan.estimated_cost_inr,
        payback_period_years: aiGeneratedPlan.payback_period_years,
        maintenance_advice: aiGeneratedPlan.maintenance_advice,
        notes: aiGeneratedPlan.notes,
        isActive: true,
      });
      
      // Return the result as JSON
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            planId,
            solarPlan: aiGeneratedPlan, 
          },
          
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error saving solar plan:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : String(error),
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});





export default http;