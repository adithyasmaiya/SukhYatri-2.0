import React, { useState, useEffect } from 'react';
import { Settings, Save, Shield, HelpCircle, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const AdminSettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    platformName: 'SukhYatri',
    supportEmail: 'concierge@sukhyatri.com',
    supportPhone: '+91 800 234 5678',
    gstNumber: '32AABCS1429B1Z8',
    currency: 'INR',
    razorpayTestMode: true,
    freeCancellationHours: 48,
    platformCommissionPct: 15,
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSettings();
      if (res) setFormData((prev) => ({ ...prev, ...res }));
    } catch (err: any) {
      toast(err.message || 'Error fetching system settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await adminService.updateSettings(formData);
      toast('Platform settings saved successfully', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to update platform settings', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-muted">
        <div className="w-8 h-8 border-4 border-moss border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading platform configuration…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">System Settings</h2>
          <p className="text-xs text-muted mt-0.5">
            Configure operations parameters, concierge channels, GSTIN & payment modes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchSettings} disabled={submitting}>
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="submit"
            className="bg-moss hover:bg-moss/90 text-white flex items-center gap-1.5"
            loading={submitting}
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </Button>
        </div>
      </div>

      {/* 1. General Platform Information */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
          <Settings className="w-4 h-4 text-moss" />
          <span>Platform Identity</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1">Platform Brand Name</label>
            <input
              value={formData.platformName}
              onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
              className="w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-3.5 py-2.5 outline-none border border-transparent focus:border-moss/40 text-ink"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1">GSTIN Number</label>
            <input
              value={formData.gstNumber}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
              className="w-full bg-[#F2F4F3] text-xs font-mono font-semibold rounded-xl px-3.5 py-2.5 outline-none border border-transparent focus:border-moss/40 text-ink"
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1">Concierge Support Email</label>
            <input
              type="email"
              value={formData.supportEmail}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              className="w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-3.5 py-2.5 outline-none border border-transparent focus:border-moss/40 text-ink"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              WhatsApp / Phone Support
            </label>
            <input
              value={formData.supportPhone}
              onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
              className="w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-3.5 py-2.5 outline-none border border-transparent focus:border-moss/40 text-ink"
              required
            />
          </div>
        </div>
      </div>

      {/* 2. Operations & Policies */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
          <Shield className="w-4 h-4 text-pine" />
          <span>Operational Policies</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              Free Cancellation Threshold (Hours before departure)
            </label>
            <input
              type="number"
              value={formData.freeCancellationHours}
              onChange={(e) =>
                setFormData({ ...formData, freeCancellationHours: Number(e.target.value) })
              }
              className="w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-3.5 py-2.5 outline-none text-ink"
            />
            <span className="text-[10px] text-muted mt-1 block">
              100% refund window prior to trip departure time
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              Default Operations Margin (%)
            </label>
            <input
              type="number"
              value={formData.platformCommissionPct}
              onChange={(e) =>
                setFormData({ ...formData, platformCommissionPct: Number(e.target.value) })
              }
              className="w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-3.5 py-2.5 outline-none text-ink"
            />
            <span className="text-[10px] text-muted mt-1 block">
              Target operating gross margin applied to vendor cost
            </span>
          </div>
        </div>
      </div>

      {/* 3. Payment Gateway Configuration */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
        <h3 className="font-display text-base font-bold text-ink">Payment Gateway State</h3>

        <div className="flex items-center justify-between p-3.5 bg-[#F9FAF9] rounded-2xl border border-[#EEF1EF]">
          <div>
            <span className="text-xs font-bold text-ink block">Razorpay Test Mode</span>
            <span className="text-[11px] text-muted">
              {formData.razorpayTestMode
                ? 'Orders are currently processed in Razorpay Sandbox (rzp_test) test mode.'
                : 'Live mode active: Real transactions and settlement.'}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, razorpayTestMode: !formData.razorpayTestMode })
            }
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              formData.razorpayTestMode ? 'bg-amber-600 text-white' : 'bg-moss text-white'
            }`}
          >
            {formData.razorpayTestMode ? 'Test Mode' : 'Live Mode'}
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          className="bg-moss hover:bg-moss/90 text-white min-w-36"
          loading={submitting}
        >
          Save Settings
        </Button>
      </div>
    </form>
  );
};
