import { apiClient, TOKEN_STORAGE_KEY, API_BASE_URL } from './apiClient';

/**
 * Helper to download CSV directly using auth token
 */
async function downloadCsvFile(endpoint: string, defaultFilename: string): Promise<void> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const res = await fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to download CSV export');
  }

  const blob = await res.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = defaultFilename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

export const adminService = {
  // 1. Dashboard
  async getDashboardStats(range: '7d' | '30d' | '90d' | '1y' = '30d') {
    return apiClient.get(`/admin/dashboard?range=${range}`);
  },

  // 2. Bookings
  async getBookings(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return apiClient.get(`/admin/bookings?${query.toString()}`);
  },

  async getBookingById(id: string) {
    return apiClient.get(`/admin/bookings/${id}`);
  },

  async cancelBooking(id: string, reason: string) {
    return apiClient.post(`/admin/bookings/${id}/cancel`, { reason });
  },

  async exportBookingsCsv(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    query.set('export', 'csv');
    const filename = `sukhyatri_bookings_${new Date().toISOString().slice(0, 10)}.csv`;
    return downloadCsvFile(`/admin/bookings?${query.toString()}`, filename);
  },

  // 3. Packages
  async getPackages(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return apiClient.get(`/admin/packages?${query.toString()}`);
  },

  async getPackageById(id: string) {
    return apiClient.get(`/admin/packages/${id}`);
  },

  async createPackage(data: any) {
    return apiClient.post('/admin/packages', data);
  },

  async updatePackage(id: string, data: any) {
    return apiClient.put(`/admin/packages/${id}`, data);
  },

  async togglePackagePublish(id: string) {
    return apiClient.patch(`/admin/packages/${id}/publish`);
  },

  async deletePackage(id: string) {
    return apiClient.delete(`/admin/packages/${id}`);
  },

  // 4. Destinations
  async getDestinations(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return apiClient.get(`/admin/destinations?${query.toString()}`);
  },

  async getDestinationById(id: string) {
    return apiClient.get(`/admin/destinations/${id}`);
  },

  async createDestination(data: any) {
    return apiClient.post('/admin/destinations', data);
  },

  async updateDestination(id: string, data: any) {
    return apiClient.put(`/admin/destinations/${id}`, data);
  },

  async toggleDestinationPublish(id: string) {
    return apiClient.patch(`/admin/destinations/${id}/publish`);
  },

  async deleteDestination(id: string) {
    return apiClient.delete(`/admin/destinations/${id}`);
  },

  // 5. Users
  async getUsers(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return apiClient.get(`/admin/users?${query.toString()}`);
  },

  async getUserDetails(id: string) {
    return apiClient.get(`/admin/users/${id}`);
  },

  async updateUserRole(id: string, role: 'user' | 'admin') {
    return apiClient.patch(`/admin/users/${id}/role`, { role });
  },

  async updateUserStatus(id: string, status: 'active' | 'suspended') {
    return apiClient.patch(`/admin/users/${id}/status`, { status });
  },

  async exportUsersCsv(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    query.set('export', 'csv');
    const filename = `sukhyatri_users_${new Date().toISOString().slice(0, 10)}.csv`;
    return downloadCsvFile(`/admin/users?${query.toString()}`, filename);
  },

  // 6. Payments
  async getPayments(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return apiClient.get(`/admin/payments?${query.toString()}`);
  },

  async exportPaymentsCsv(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    query.set('export', 'csv');
    const filename = `sukhyatri_payments_${new Date().toISOString().slice(0, 10)}.csv`;
    return downloadCsvFile(`/admin/payments?${query.toString()}`, filename);
  },

  // 7. Coupons
  async getCoupons(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return apiClient.get(`/admin/coupons?${query.toString()}`);
  },

  async createCoupon(data: any) {
    return apiClient.post('/admin/coupons', data);
  },

  async updateCoupon(id: string, data: any) {
    return apiClient.put(`/admin/coupons/${id}`, data);
  },

  async toggleCouponActive(id: string) {
    return apiClient.patch(`/admin/coupons/${id}/toggle`);
  },

  async deleteCoupon(id: string) {
    return apiClient.delete(`/admin/coupons/${id}`);
  },

  // 8. Reviews
  async getReviews(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return apiClient.get(`/admin/reviews?${query.toString()}`);
  },

  async updateReviewStatus(id: string, status: 'approved' | 'rejected' | 'pending') {
    return apiClient.patch(`/admin/reviews/${id}/status`, { status });
  },

  async deleteReview(id: string) {
    return apiClient.delete(`/admin/reviews/${id}`);
  },

  // 9. Analytics
  async getAnalytics() {
    return apiClient.get('/admin/analytics');
  },

  // 10. Settings
  async getSettings() {
    return apiClient.get('/admin/settings');
  },

  async updateSettings(data: any) {
    return apiClient.put('/admin/settings', data);
  },
};
