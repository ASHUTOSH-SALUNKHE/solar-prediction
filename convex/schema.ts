import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  plans: defineTable({
    userId: v.string(),
    recommended_capacity_kw: v.float64(),
    total_solar_panel: v.number(),
    panel_rating: v.number(),
    tilt_angle: v.number(),
    solar_panel_type: v.string(),
    location: v.string(),

    // new fields added below
    required_area_sq_m: v.number(),
    estimated_monthly_generation_kwh: v.number(),
    estimated_monthly_savings_inr: v.number(),
    estimated_cost_inr: v.number(),
    payback_period_years: v.number(),
    maintenance_advice: v.string(),
    notes: v.optional(v.string()), // can be optional
    isActive: v.boolean(),
  }).index("by_user_id", ["userId"]),


  weatherData: defineTable({
    userId: v.string(), // Unique identifier for the user
    Latitude: v.float64(), // Latitude of the location
    Longitude: v.float64(), // Longitude of the location
    userLocation : v.string(),
    monthly_data: v.array(
      v.object({
        month: v.number(), // Month number (1 for January, 12 for December)
        min_temperature: v.optional(v.number()), // Minimum temperature for the month
        max_temperature: v.optional(v.number()), // Maximum temperature for the month
        average_humidity: v.optional(v.number()), // Average humidity for the month
        average_windspeed: v.optional(v.number()), // Average wind speed for the month
        average_radiation: v.optional(v.number()), // Average shortwave radiation for the month
      })
    ),
  }).index("by_user_id", ["userId"]),
  
  
});