import { Ride } from "../ride/ride.model";

class AnalyticsService {
  // Ride Volume by day/month
  async getRideVolume(period: "day" | "month") {
    const groupId =
      period === "day"
        ? {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          }
        : { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };

    return Ride.aggregate([
      { $group: { _id: groupId, totalRides: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);
  }

  // Revenue trends by day/month
  async getRevenueTrends(period: "day" | "month") {
    const groupId =
      period === "day"
        ? {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          }
        : { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };

    return Ride.aggregate([
      { $group: { _id: groupId, totalRevenue: { $sum: "$fare" } } },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);
  }

  // Driver activity
  async getDriverActivity() {
    return Ride.aggregate([
      {
        $group: {
          _id: "$driver",
          ridesCompleted: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users", // <-- ensure this is the correct collection for drivers
          localField: "_id",
          foreignField: "_id",
          as: "driverDetails",
        },
      },
      { $unwind: "$driverDetails" },
      {
        $project: {
          _id: 0,
          driverId: "$driverDetails._id",
          driverName: "$driverDetails.name",
          ridesCompleted: 1,
        },
      },
      { $sort: { ridesCompleted: -1 } },
    ]);
  }
}

export const analyticsService = new AnalyticsService();
