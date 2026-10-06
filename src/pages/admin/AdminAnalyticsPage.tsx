import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  CreditCard,
  Users,
  Compass,
  CalendarCheck,
  RefreshCw,
  Package,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatINR } from '../../utils/format';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const AdminAnalyticsPage: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAnalytics();
      setData(res);
    } catch (err: any) {
      toast(err.message || 'Error loading analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const revenue = data?.revenue || { daily: 0, weekly: 0, monthly: 0, yearly: 0 };
  const bookings = data?.bookings || { total: 0, confirmed: 0, cancelled: 0, pending: 0 };
  const customers = data?.customers || { totalUsers: 0, newUsers: 0, returningUsers: 0 };
  const topDestinations = data?.destinations || [];
  const topPackages = data?.packages || [];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Operational Analytics</h2>
          <p className="text-xs text-muted mt-0.5">
            Deep-dive revenue cadence, guest retention cohorts & route performance
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={loading}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="ml-1.5 hidden sm:inline">Refresh Data</span>
        </Button>
      </div>

      {/* 1. Revenue Velocity Metrics */}
      <div className="space-y-3">
        <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wider text-muted">
          Revenue Cadence
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl border border-[#DFE5E2] p-5 shadow-xs space-y-1">
            <div className="text-[10.5px] font-bold text-muted uppercase">Today's Revenue</div>
            {loading ? (
              <div className="h-8 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <div className="font-display text-2xl font-bold text-ink">
                {formatINR(revenue.daily)}
              </div>
            )}
            <div className="text-[10px] text-muted font-medium">Last 24 hours</div>
          </div>

          <div className="bg-white rounded-3xl border border-[#DFE5E2] p-5 shadow-xs space-y-1">
            <div className="text-[10.5px] font-bold text-muted uppercase">Past 7 Days</div>
            {loading ? (
              <div className="h-8 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <div className="font-display text-2xl font-bold text-ink">
                {formatINR(revenue.weekly)}
              </div>
            )}
            <div className="text-[10px] text-muted font-medium">Weekly velocity</div>
          </div>

          <div className="bg-white rounded-3xl border border-[#DFE5E2] p-5 shadow-xs space-y-1">
            <div className="text-[10.5px] font-bold text-muted uppercase">Past 30 Days</div>
            {loading ? (
              <div className="h-8 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <div className="font-display text-2xl font-bold text-moss">
                {formatINR(revenue.monthly)}
              </div>
            )}
            <div className="text-[10px] text-moss font-semibold">Rolling monthly run-rate</div>
          </div>

          <div className="bg-white rounded-3xl border border-[#DFE5E2] p-5 shadow-xs space-y-1">
            <div className="text-[10.5px] font-bold text-muted uppercase">Trailing 1 Year</div>
            {loading ? (
              <div className="h-8 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <div className="font-display text-2xl font-bold text-ink">
                {formatINR(revenue.yearly)}
              </div>
            )}
            <div className="text-[10px] text-muted font-medium">Annual gross bookings</div>
          </div>
        </div>
      </div>

      {/* 2. Bookings Distribution & Customer Cohorts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bookings Status Breakdown */}
        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-moss" />
            <h3 className="font-display text-base font-bold text-ink">
              Booking Status Distribution
            </h3>
          </div>

          {loading ? (
            <div className="h-44 bg-gray-100 rounded-2xl animate-pulse" />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2 text-center p-3.5 bg-[#F9FAF9] rounded-2xl">
                <div>
                  <div className="font-display text-2xl font-bold text-ink">{bookings.total}</div>
                  <div className="text-[10px] text-muted font-semibold uppercase">Total</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-moss">
                    {bookings.confirmed}
                  </div>
                  <div className="text-[10px] text-moss font-semibold uppercase">Confirmed</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-amber-600">
                    {bookings.pending}
                  </div>
                  <div className="text-[10px] text-muted font-semibold uppercase">Pending</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-clay">
                    {bookings.cancelled}
                  </div>
                  <div className="text-[10px] text-clay font-semibold uppercase">Cancelled</div>
                </div>
              </div>

              {bookings.total > 0 && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span>Confirmation Rate</span>
                    <span className="text-moss">
                      {Math.round((bookings.confirmed / bookings.total) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                    <div
                      style={{
                        width: `${Math.round((bookings.confirmed / bookings.total) * 100)}%`,
                      }}
                      className="bg-moss"
                    />
                    <div
                      style={{
                        width: `${Math.round((bookings.cancelled / bookings.total) * 100)}%`,
                      }}
                      className="bg-clay"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Customer Cohorts */}
        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-pine" />
            <h3 className="font-display text-base font-bold text-ink">Guest Retention Cohorts</h3>
          </div>

          {loading ? (
            <div className="h-44 bg-gray-100 rounded-2xl animate-pulse" />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center p-3.5 bg-[#F9FAF9] rounded-2xl">
                <div>
                  <div className="font-display text-2xl font-bold text-ink">
                    {customers.totalUsers}
                  </div>
                  <div className="text-[10px] text-muted font-semibold uppercase">Registered</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-pine">
                    {customers.newUsers}
                  </div>
                  <div className="text-[10px] text-muted font-semibold uppercase">First-Time</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-sand">
                    {customers.returningUsers}
                  </div>
                  <div className="text-[10px] text-muted font-semibold uppercase">Repeat Yatris</div>
                </div>
              </div>

              <div className="p-3 bg-cream2/60 rounded-2xl border border-stonewarm text-xs text-ink space-y-1">
                <span className="font-bold block">Repeat Traveler Index</span>
                <p className="text-[11px] text-muted">
                  {customers.totalUsers > 0
                    ? `${Math.round(
                        (customers.returningUsers / customers.totalUsers) * 100
                      )}% of registered travelers have embarked on multiple SukhYatri circuits.`
                    : 'Data unavailable'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Top Destinations & Packages by Actual Bookings */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Destinations */}
        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-moss" />
            <h3 className="font-display text-base font-bold text-ink">
              Top Destinations by Revenue
            </h3>
          </div>

          {topDestinations.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted">
              Data unavailable or no destination orders yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {topDestinations.map((d: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FBFDFB] border border-[#EEF1EF] text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-sand/30 font-bold text-ink text-[11px] flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-ink">{d.destination}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-ink">{formatINR(d.revenue)}</div>
                    <div className="text-[10.5px] text-muted">{d.bookings} Bookings</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Packages */}
        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-pine" />
            <h3 className="font-display text-base font-bold text-ink">Most Booked Packages</h3>
          </div>

          {topPackages.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted">
              Data unavailable or no package bookings yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {topPackages.map((p: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FBFDFB] border border-[#EEF1EF] text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="w-6 h-6 rounded-full bg-moss/20 font-bold text-moss text-[11px] flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="font-bold text-ink truncate">{p.title}</div>
                      <div className="text-[10.5px] text-muted">{p.destination}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-ink">{formatINR(p.revenue)}</div>
                    <div className="text-[10.5px] text-muted">{p.bookings} Bookings</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
