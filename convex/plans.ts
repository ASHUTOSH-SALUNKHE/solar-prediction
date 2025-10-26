import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPlan = mutation({
  args: {
    userId: v.string(),
    recommended_capacity_kw: v.float64(),
    total_solar_panel: v.number(),
    panel_rating: v.number(),
    tilt_angle: v.number(),
    solar_panel_type: v.string(),
    location: v.string(),
    required_area_sq_m: v.number(),
    estimated_monthly_generation_kwh: v.number(),
    estimated_monthly_savings_inr: v.number(),
    estimated_cost_inr: v.number(),
    payback_period_years: v.number(),
    maintenance_advice: v.string(),
    notes: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Deactivate previous active plans
    const activePlans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    for (const plan of activePlans) {
      await ctx.db.delete(plan._id);
    }

    // Create new solar plan
    const planId = await ctx.db.insert("plans", args);
    return planId;
  },
});

export const getWeatherByUserId = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
      const weather = await ctx.db
        .query("weatherData")
        .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
        .unique();
      return weather !== null;
      // returns true if found, false if not found
    },
  });
  

export const createWeatherData = mutation({
    args: {
      userId: v.string(),
      latitude: v.float64(),
      longitude: v.float64(),
      userlocation: v.string(),
      monthly_data: v.array(
        v.object({
          month: v.number(),
          min_temperature: v.optional(v.number()),
          max_temperature: v.optional(v.number()),
          average_humidity: v.optional(v.number()),
          average_windspeed: v.optional(v.number()),
          average_radiation: v.optional(v.number()),
        })
      ), // Added monthly_data argument
    },
    handler: async (ctx, args) => {
      // Check if there's already an existing weather data for this userId
      const existingWeatherData = await ctx.db
        .query("weatherData")
        .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
        .collect();
  
      if (existingWeatherData.length > 0) {
        // If the user data exists, update the record with new latitude, longitude, location, and monthly data
        await ctx.db.patch(existingWeatherData[0]._id, {
          Latitude: args.latitude,
          Longitude: args.longitude,
          userLocation: args.userlocation, // Update location as well
          monthly_data: args.monthly_data, // Update the monthly data
        });
        console.log("Weather data updated successfully!");
      } else {
        // If no data exists, create a new entry with the user location, latitude, longitude, and monthly data
        const weatherDataId = await ctx.db.insert("weatherData", {
          userId: args.userId,
          Latitude: args.latitude,
          Longitude: args.longitude,
          userLocation: args.userlocation, // Ensure userLocation is added
          monthly_data: args.monthly_data, // Insert monthly data
        });
        console.log("Weather data created successfully!");
      }
    },
  });


  export const getWeather = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
      const weather = await ctx.db
        .query("weatherData")
        .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
        .unique(); // use .collect() if expecting multiple entries
  
      return weather; // will return null if not found
    },
  });



export const getUserPlans = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const plans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect(); // use .collect() to get all

    return plans;
  },
});

  
  
  





  