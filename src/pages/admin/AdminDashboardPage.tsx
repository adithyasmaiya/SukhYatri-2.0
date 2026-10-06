import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { formatINR, formatDate } from '../../utils/format';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  TrendingUp,
  CreditCard,
  CalendarCheck,
  Users,
  Compass,
  Clock,
  Eye,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [range, setRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const fetchStats = async (selectedRange: '7d' | '30d' | '90d' | '1y') => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getDashboardStats(selectedRange);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(range);
  }, [range]);

  const kpis = data?.kpis || {
    totalRevenue: 0,
    totalBookings: 0,
    totalCustomers: 0,
    activeTrips: 0,
    pendingPayments: 0,
    upcomingTrips: 0,
  };

  const revenuePoints = data?.revenueChart || [];
  const bookingTrends = data?.bookingTrends || [];
  const popularDestinations = data?.popularDestinations || [];
  const recentBookings = data?.recentBookings || [];

  // Calculate SVG curve for revenue
  const maxRevenue = Math.max(...revenuePoints.map((p: any) => p.revenue), 1000);
  const svgWidth = 600;
  const svgHeight = 180;
  const paddingX = 40;
  const paddingY = 30;

  const points = revenuePoints.map((p: any, idx: number) => {
    const x =
      revenuePoints.length > 1
        ? paddingX + (idx / (revenuePoints.length - 1)) * (svgWidth - paddingX * 2)
        : svgWidth / 2;
    const y =
      svgHeight -
      paddingY -
      (p.revenue / maxRevenue) * (svgHeight - paddingY * 2);
    return { x, y, revenue: p.revenue, date: p.date };
  });

  const pathD =
    points.length > 0
      ? points.reduce(
          (acc: string, pt: any, i: number) =>
            i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`,
          ''
        )
      : '';

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${
          points[0].x
        } ${svgHeight - paddingY} Z`
      : '';

  return (
    <div className="space-y-7">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Operations Overview</h2>
          <p className="text-xs text-muted mt-0.5">
            Real-time operations metrics, booking velocity, and fiscal performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Range Picker */}
          <div className="bg-white rounded-xl p-1 border border-[#DFE5E2] flex items-center shadow-xs">
            {(['7d', '30d', '90d', '1y'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  range === r
                    ? 'bg-ink text-white shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchStats(range)}
            className="flex items-center gap-1.5"
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-clay/10 border border-clay/30 rounded-2xl flex items-center gap-3 text-clay text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* 1. Total Revenue */}
        <div className="bg-white rounded-2xl border border-[#DFE5E2] p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-7 h-7 rounded-lg bg-moss/10 text-moss flex items-center justify-center">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          {loading ? (
            <div className="h-8 bg-gray-100 rounded-md animate-pulse my-1" />
          ) : (
            <div className="font-display text-2xl font-bold text-ink">
              {formatINR(kpis.totalRevenue)}
            </div>
          )}
          <div className="text-[10px] text-moss font-semibold mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3 inline" />
            <span>Realized earnings</span>
          </div>
        </div>

        {/* 2. Total Bookings */}
        <div className="bg-white rounded-2xl border border-[#DFE5E2] p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Total Bookings
            </span>
            <div className="w-7 h-7 rounded-lg bg-pine/10 text-pine flex items-center justify-center">
              <CalendarCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          {loading ? (
            <div className="h-8 bg-gray-100 rounded-md animate-pulse my-1" />
          ) : (
            <div className="font-display text-2xl font-bold text-ink">
              {kpis.totalBookings}
            </div>
          )}
          <div className="text-[10px] text-muted font-semibold mt-1">
            Confirmed & pending
          </div>
        </div>

        {/* 3. Customers */}
        <div className="bg-white rounded-2xl border border-[#DFE5E2] p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Customers
            </span>
            <div className="w-7 h-7 rounded-lg bg-sand/20 text-ink flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          {loading ? (
            <div className="h-8 bg-gray-100 rounded-md animate-pulse my-1" />
          ) : (
            <div className="font-display text-2xl font-bold text-ink">
              {kpis.totalCustomers}
            </div>
          )}
          <div className="text-[10px] text-muted font-semibold mt-1">
            Registered travelers
          </div>
        </div>

        {/* 4. Active Trips */}
        <div className="bg-white rounded-2xl border border-[#DFE5E2] p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Active Trips
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Compass className="w-3.5 h-3.5" />
            </div>
          </div>
          {loading ? (
            <div className="h-8 bg-gray-100 rounded-md animate-pulse my-1" />
          ) : (
            <div className="font-display text-2xl font-bold text-ink">
              {kpis.activeTrips}
            </div>
          )}
          <div className="text-[10px] text-muted font-semibold mt-1">
            Published packages
          </div>
        </div>

        {/* 5. Pending Payments */}
        <div className="bg-white rounded-2xl border border-[#DFE5E2] p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Pending Pay
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          {loading ? (
            <div className="h-8 bg-gray-100 rounded-md animate-pulse my-1" />
          ) : (
            <div className="font-display text-2xl font-bold text-amber-700">
              {kpis.pendingPayments}
            </div>
          )}
          <div className="text-[10px] text-muted font-semibold mt-1">
            Awaiting checkout
          </div>
        </div>

        {/* 6. Upcoming Trips */}
        <div className="bg-white rounded-2xl border border-[#DFE5E2] p-4.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Upcoming
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          {loading ? (
            <div className="h-8 bg-gray-100 rounded-md animate-pulse my-1" />
          ) : (
            <div className="font-display text-2xl font-bold text-ink">
              {kpis.upcomingTrips}
            </div>
          )}
          <div className="text-[10px] text-muted font-semibold mt-1">
            Departing soon
          </div>
        </div>
      </div>

      {/* Charts Section: Revenue Chart & Booking Trends */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-ink text-base">Revenue Over Time</h3>
              <p className="text-xs text-muted">
                Timeline revenue progression ({range.toUpperCase()})
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted font-medium">Period High</div>
              <div className="text-sm font-bold text-ink">{formatINR(maxRevenue)}</div>
            </div>
          </div>

          {loading ? (
            <div className="h-52 bg-gray-100 rounded-2xl animate-pulse" />
          ) : revenuePoints.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-xs text-muted">
              No revenue recorded in this time range.
            </div>
          ) : (
            <div className="w-full h-56 pt-2">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1B4D3E" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#1B4D3E" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal lines */}
                <line
                  x1={paddingX}
                  y1={paddingY}
                  x2={svgWidth - paddingX}
                  y2={paddingY}
                  stroke="#EBF0ED"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <line
                  x1={paddingX}
                  y1={(svgHeight - paddingY * 2) / 2 + paddingY}
                  x2={svgWidth - paddingX}
                  y2={(svgHeight - paddingY * 2) / 2 + paddingY}
                  stroke="#EBF0ED"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <line
                  x1={paddingX}
                  y1={svgHeight - paddingY}
                  x2={svgWidth - paddingX}
                  y2={svgHeight - paddingY}
                  stroke="#DFE5E2"
                  strokeWidth="1"
                />

                {/* Fill Area */}
                {areaD && <path d={areaD} fill="url(#adminChartGrad)" />}

                {/* Curve */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#1B4D3E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points */}
                {points.map((pt: any, i: number) => (
                  <g key={i} className="group cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4"
                      fill="#FFFFFF"
                      stroke="#1B4D3E"
                      strokeWidth="2.5"
                      className="transition-transform group-hover:scale-150"
                    />
                  </g>
                ))}
              </svg>

              {/* Labels */}
              <div className="flex justify-between text-[10px] text-muted font-medium mt-2 px-6">
                <span>{revenuePoints[0]?.date}</span>
                <span>{revenuePoints[Math.floor(revenuePoints.length / 2)]?.date}</span>
                <span>{revenuePoints[revenuePoints.length - 1]?.date}</span>
              </div>
            </div>
          )}
        </div>

        {/* Bookings Trends Breakdown */}
        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-extrabold text-ink text-base">Booking Trends</h3>
            <p className="text-xs text-muted">Confirmed vs Pending vs Cancelled</p>
          </div>

          {loading ? (
            <div className="h-52 bg-gray-100 rounded-2xl animate-pulse" />
          ) : bookingTrends.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-xs text-muted">
              No recent booking trends recorded.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center p-3 bg-[#F8FAF9] rounded-2xl">
                <div>
                  <div className="text-base font-bold text-moss">
                    {bookingTrends.reduce((s: number, b: any) => s + (b.confirmed || 0), 0)}
                  </div>
                  <div className="text-[10px] text-muted font-semibold uppercase">Confirmed</div>
                </div>
                <div>
                  <div className="text-base font-bold text-amber-600">
                    {bookingTrends.reduce((s: number, b: any) => s + (b.pending || 0), 0)}
                  </div>
                  <div className="text-[10px] text-muted font-semibold uppercase">Pending</div>
                </div>
                <div>
                  <div className="text-base font-bold text-clay">
                    {bookingTrends.reduce((s: number, b: any) => s + (b.cancelled || 0), 0)}
                  </div>
                  <div className="text-[10px] text-muted font-semibold uppercase">Cancelled</div>
                </div>
              </div>

              {/* Trend bars */}
              <div className="space-y-2.5">
                {bookingTrends.slice(-5).map((trend: any, idx: number) => {
                  const total = trend.total || 1;
                  const confirmedPct = Math.round(((trend.confirmed || 0) / total) * 100);
                  const cancelledPct = Math.round(((trend.cancelled || 0) / total) * 100);
                  const pendingPct = 100 - confirmedPct - cancelledPct;

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-ink">
                        <span>{trend.period}</span>
                        <span className="text-muted">{trend.total} bookings</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full flex overflow-hidden">
                        <div
                          style={{ width: `${confirmedPct}%` }}
                          className="bg-moss"
                          title={`Confirmed: ${trend.confirmed}`}
                        />
                        <div
                          style={{ width: `${pendingPct}%` }}
                          className="bg-amber-400"
                          title={`Pending: ${trend.pending}`}
                        />
                        <div
                          style={{ width: `${cancelledPct}%` }}
                          className="bg-clay"
                          title={`Cancelled: ${trend.cancelled}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row: Popular Destinations & Recent Bookings */}
      <div className="grid lg:grid-cols-[1fr_1.8fr] gap-6">
        {/* Popular Destinations */}
        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-ink text-base">Popular Destinations</h3>
              <p className="text-xs text-muted">Ranked by actual booking volume</p>
            </div>
            <Link
              to="/admin/destinations"
              className="text-xs font-bold text-moss hover:underline"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : popularDestinations.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted">
              No destination bookings yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EEF1EF] text-[10px] text-muted uppercase font-bold">
                    <th className="pb-2.5">Destination</th>
                    <th className="pb-2.5 text-center">Bookings</th>
                    <th className="pb-2.5 text-right">Revenue</th>
                    <th className="pb-2.5 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F5F3]">
                  {popularDestinations.map((dest: any) => (
                    <tr key={dest.destination} className="hover:bg-[#F9FAF9] transition">
                      <td className="py-3 font-semibold text-ink">{dest.destination}</td>
                      <td className="py-3 text-center font-bold text-muted">
                        {dest.bookings}
                      </td>
                      <td className="py-3 text-right font-medium text-ink">
                        {formatINR(dest.revenue)}
                      </td>
                      <td className="py-3 text-right font-bold text-moss">
                        ★ {dest.rating || 4.9}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-ink text-base">Recent Bookings</h3>
              <p className="text-xs text-muted">Latest operations flow across destinations</p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-bold text-moss hover:underline"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted">
              No bookings recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EEF1EF] text-[10px] text-muted uppercase font-bold">
                    <th className="pb-2.5">Booking ID</th>
                    <th className="pb-2.5">Customer</th>
                    <th className="pb-2.5">Trip</th>
                    <th className="pb-2.5">Travel Date</th>
                    <th className="pb-2.5 text-right">Amount</th>
                    <th className="pb-2.5 text-center">Status</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F5F3]">
                  {recentBookings.map((b: any) => (
                    <tr key={b._id || b.bookingId} className="hover:bg-[#F9FAF9] transition">
                      <td className="py-3 font-mono font-bold text-ink">
                        {b.bookingId}
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-ink leading-tight">
                          {b.primaryTraveller?.name || 'Guest'}
                        </div>
                        <div className="text-[10px] text-muted truncate max-w-[120px]">
                          {b.primaryTraveller?.email}
                        </div>
                      </td>
                      <td className="py-3 max-w-[140px] truncate text-ink font-medium">
                        {b.tripSnapshot?.title || b.destinationName}
                      </td>
                      <td className="py-3 text-muted font-medium whitespace-nowrap">
                        {formatDate(b.travelDate)}
                      </td>
                      <td className="py-3 text-right font-bold text-ink whitespace-nowrap">
                        {formatINR(b.pricing?.totalAmount || b.amountPaid || 0)}
                      </td>
                      <td className="py-3 text-center whitespace-nowrap">
                        <Badge
                          variant={
                            b.bookingStatus === 'confirmed'
                              ? 'success'
                              : b.bookingStatus === 'cancelled'
                              ? 'error'
                              : 'warning'
                          }
                        >
                          {b.bookingStatus}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/admin/bookings/${b.bookingId}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F2F4F3] hover:bg-ink hover:text-white text-ink font-semibold text-[11px] transition"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
