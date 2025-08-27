import mongoose from "mongoose";
import { RideStatus } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";

const getEarningStats = async (driverId: string) => {
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const totalCountPromise = Ride.countDocuments({
    driver: new mongoose.Types.ObjectId(driverId),
    status: RideStatus.COMPLETED,
  });

  const totalEarningPromise = Ride.aggregate([
    {
      $match: {
        driver: new mongoose.Types.ObjectId(driverId),
        status: RideStatus.COMPLETED,
      },
    },
    {
      $group: { _id: null, totalEarning: { $sum: "$fare" } },
    },
  ]);

  const avgEarningPromise = Ride.aggregate([
    {
      $match: {
        driver: new mongoose.Types.ObjectId(driverId),
        status: RideStatus.COMPLETED,
      },
    },
    {
      $group: { _id: null, avgIncome: { $avg: "$fare" } },
    },
  ]);

  const dailyPromise = Ride.aggregate([
    {
      $match: {
        driver: new mongoose.Types.ObjectId(driverId),
        status: RideStatus.COMPLETED,
        createdAt: { $gte: startOfToday },
      },
    },
    {
      $group: { _id: null, dailyEarning: { $sum: "$fare" } },
    },
  ]);

  const last7DaysPromise = Ride.aggregate([
    {
      $match: {
        driver: new mongoose.Types.ObjectId(driverId),
        status: RideStatus.COMPLETED,
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: { _id: null, earningLast7Days: { $sum: "$fare" } },
    },
  ]);

  const last30DaysPromise = Ride.aggregate([
    {
      $match: {
        driver: new mongoose.Types.ObjectId(driverId),
        status: RideStatus.COMPLETED,
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: { _id: null, earningLast30Days: { $sum: "$fare" } },
    },
  ]);

  const [
    totalCount,
    totalEarningAgg,
    avgEarningAgg,
    dailyAgg,
    last7DaysAgg,
    last30DaysAgg,
  ] = await Promise.all([
    totalCountPromise,
    totalEarningPromise,
    avgEarningPromise,
    dailyPromise,
    last7DaysPromise,
    last30DaysPromise,
  ]);

  return {
    totalCount,
    totalEarning: totalEarningAgg[0]?.totalEarning || 0,
    avgEarning: avgEarningAgg[0]?.avgIncome || 0,
    daily: dailyAgg[0]?.dailyEarning || 0,
    earningLast7Days: last7DaysAgg[0]?.earningLast7Days || 0,
    earningLast30Days: last30DaysAgg[0]?.earningLast30Days || 0,
  };
};

export const StatsService = { getEarningStats };
