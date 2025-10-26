"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useMutation } from "convex/react"; // Import useMutation from convex
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Import the mutation to store weather data
// Ensure this path is correct

function Page() {
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { user } = useUser();
  const router = useRouter();
  // Use the mutation to store weather data
  const createWeatherDataMutation = useMutation(api.plans.createWeatherData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      alert("Please fill both latitude and longitude!");
      return;
    }

    try {
      // Fetch address using the Nominatim Reverse Geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();

      if (data && data.display_name) {
        setLocationName(data.display_name); // Save address to display
        setError(""); // Reset any previous errors
        setOpen(true); // Open confirmation dialog
      } else {
        setLocationName("");
        setError("Could not find address. Please enter correct coordinates.");
        setOpen(true); // Open dialog to show error message
      }
    } catch (error: unknown) {
      console.error("Error fetching location:", error);
      setLocationName("");
      setError("Failed to fetch location. Try again.");
      setOpen(true); // Open dialog to show error message
    }
  };

  const handleConfirm = async () => {
    if (error) {
      // If there's an error (location not found), prevent storing the data
      alert("Cannot store data because the location was not found.");
      return;
    }

    console.log("Confirmed location:", { latitude, longitude });

    // Replace with the actual userId
    const userId: string = user?.id ?? "";

    try {
      // Fetch weather data using the latitude and longitude
      const monthlyAverages = await fetchWeatherData(latitude, longitude);

      // Prepare the data to be inserted into the database
      const monthlyDataToInsert = Object.keys(monthlyAverages).map((key) => {
        const month = parseInt(key, 10);
        const averages = monthlyAverages[month];
        return {
          month: month + 1,
          min_temperature: averages.min_temperature,
          max_temperature: averages.max_temperature,
          average_humidity:
            averages.average_humidity === null
              ? undefined
              : averages.average_humidity,
          average_windspeed: averages.average_windspeed,
          average_radiation: averages.average_radiation,
        };
      });

      // Call the mutation to insert the data into Convex
      await createWeatherDataMutation({
        userId,
        latitude,
        longitude,
        userlocation: locationName, // The location name from the reverse geocoding API
        monthly_data: monthlyDataToInsert,
      });

      console.log("Weather data stored successfully!");
      setOpen(false); // Close the confirmation dialog after storing the data
      router.push("/generate-program");
    } catch (error: unknown) {
      console.error("Error storing weather data:", error);
      setError("Failed to fetch or store weather data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md ">
        <Card className="max-w-md mx-auto p-6 bg-black rounded-xl shadow-md space-y-6  ">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Enter Your Location
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Please provide your latitude and longitude
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="latitude"
                className="text-sm font-medium text-white"
              >
                Latitude
              </label>
              <input
                id="latitude"
                type="number" // Changed to 'number'
                value={latitude || ""} // Ensure it's treated as a number or empty string
                onChange={(e) => setLatitude(parseFloat(e.target.value))} // Convert to number
                placeholder="Enter latitude"
                className="border border-gray-300 rounded-md p-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="longitude"
                className="text-sm font-medium text-white"
              >
                Longitude
              </label>
              <input
                id="longitude"
                type="number" // Changed to 'number'
                value={longitude || ""} // Ensure it's treated as a number or empty string
                onChange={(e) => setLongitude(parseFloat(e.target.value))} // Convert to number
                placeholder="Enter longitude"
                className="border border-gray-300 rounded-md p-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
            >
              Submit
            </button>
          </CardFooter>
        </Card>

        {/* Alert Dialog here (outside Card) */}
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Your Location</AlertDialogTitle>
              <AlertDialogDescription>
                Is this your correct location?
                <br />
                {locationName ? (
                  <>
                    <span className="font-semibold">Address:</span>{" "}
                    {locationName}
                  </>
                ) : (
                  <span className="text-red-500">{error}</span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>No</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>Yes</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </div>
  );
}

const fetchWeatherData = async (latitude: number, longitude: number) => {
  try {
    const weatherResponse = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=2024-01-01&end_date=2024-12-31&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,shortwave_radiation_sum,relative_humidity_2m_min&timezone=Asia%2FKolkata`
    );

    if (!weatherResponse.ok) throw new Error("Failed to fetch weather data");
    const weatherData = await weatherResponse.json();

    // Process the weather data into monthly averages
    const dates = weatherData.daily.time;
    const tempMin = weatherData.daily.temperature_2m_min;
    const tempMax = weatherData.daily.temperature_2m_max;
    const humidity = weatherData.daily.relative_humidity_2m_min || null;
    const windspeed = weatherData.daily.windspeed_10m_max;
    const radiation = weatherData.daily.shortwave_radiation_sum;

    const monthlyData: { [key: string]: any } = {};

    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const month = date.getMonth();

      if (!monthlyData[month]) {
        monthlyData[month] = {
          tempMinSum: 0,
          tempMinCount: 0,
          tempMaxSum: 0,
          tempMaxCount: 0,
          humiditySum: 0,
          humidityCount: 0,
          windspeedSum: 0,
          windspeedCount: 0,
          radiationSum: 0,
          radiationCount: 0,
        };
      }

      monthlyData[month].tempMinSum += tempMin[i];
      monthlyData[month].tempMinCount++;
      monthlyData[month].tempMaxSum += tempMax[i];
      monthlyData[month].tempMaxCount++;

      if (humidity) {
        monthlyData[month].humiditySum += humidity[i];
        monthlyData[month].humidityCount++;
      }

      monthlyData[month].windspeedSum += windspeed[i];
      monthlyData[month].windspeedCount++;

      monthlyData[month].radiationSum += radiation[i];
      monthlyData[month].radiationCount++;
    }

    // Calculate the averages for each month
    const monthlyAverages: { [month: number]: any } = {};

    for (let month = 0; month < 12; month++) {
      const data = monthlyData[month];
      if (data) {
        monthlyAverages[month] = {
          min_temperature: parseFloat(
            (data.tempMinSum / data.tempMinCount).toFixed(2)
          ),
          max_temperature: parseFloat(
            (data.tempMaxSum / data.tempMaxCount).toFixed(2)
          ),
          average_humidity: humidity
            ? parseFloat((data.humiditySum / data.humidityCount).toFixed(2))
            : null,
          average_windspeed: parseFloat(
            (data.windspeedSum / data.windspeedCount).toFixed(2)
          ),
          average_radiation: parseFloat(
            (data.radiationSum / data.radiationCount).toFixed(2)
          ),
        };
      }
    }

    // Return the monthly averages data
    return monthlyAverages;
  } catch (error: unknown) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export default Page;
