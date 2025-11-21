import type { DashboardStats } from "../api/dashboard.types";

interface DashboardStatsProps {
  data: DashboardStats;
  user: { name: string } | null;
}

export const DashboardStatsSection = ({ data, user }: DashboardStatsProps) => {
  return (
    <section id="overview">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-gray-500 text-sm font-medium">Total Points</h3>
          <p className="text-3xl font-bold mt-2">{data.points}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-gray-500 text-sm font-medium">Active Listings</h3>
          <p className="text-3xl font-bold mt-2">{data.activeListingsCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-gray-500 text-sm font-medium">Total Listings</h3>
          <p className="text-3xl font-bold mt-2">{data.totalListings}</p>
        </div>
      </div>
    </section>
  );
};
