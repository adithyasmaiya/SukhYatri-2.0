import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Providers & Components
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingState } from './components/ui/LoadingState';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Core Critical Customer Pages (Loaded eagerly for instant first-paint)
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { DestinationsPage } from './pages/DestinationsPage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { TripDetailPage } from './pages/TripDetailPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';

// Route-level Code Splitting for heavy/secondary routes
const BookingPage = lazy(() =>
  import('./pages/BookingPage').then((m) => ({ default: m.BookingPage }))
);
const TripConfirmationPage = lazy(() =>
  import('./pages/TripConfirmationPage').then((m) => ({ default: m.TripConfirmationPage }))
);
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const MyTripsPage = lazy(() =>
  import('./pages/MyTripsPage').then((m) => ({ default: m.MyTripsPage }))
);
const BookingDetailPage = lazy(() =>
  import('./pages/BookingDetailPage').then((m) => ({ default: m.BookingDetailPage }))
);

// Admin Routes (Lazy-loaded to keep customer bundle lean)
const AdminDashboardPage = lazy(() =>
  import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminBookingsPage = lazy(() =>
  import('./pages/admin/AdminBookingsPage').then((m) => ({ default: m.AdminBookingsPage }))
);
const AdminBookingDetailPage = lazy(() =>
  import('./pages/admin/AdminBookingDetailPage').then((m) => ({ default: m.AdminBookingDetailPage }))
);
const AdminPackagesPage = lazy(() =>
  import('./pages/admin/AdminPackagesPage').then((m) => ({ default: m.AdminPackagesPage }))
);
const AdminPackageFormPage = lazy(() =>
  import('./pages/admin/AdminPackageFormPage').then((m) => ({ default: m.AdminPackageFormPage }))
);
const AdminDestinationsPage = lazy(() =>
  import('./pages/admin/AdminDestinationsPage').then((m) => ({ default: m.AdminDestinationsPage }))
);
const AdminDestinationFormPage = lazy(() =>
  import('./pages/admin/AdminDestinationFormPage').then((m) => ({ default: m.AdminDestinationFormPage }))
);
const AdminUsersPage = lazy(() =>
  import('./pages/admin/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage }))
);
const AdminUserDetailPage = lazy(() =>
  import('./pages/admin/AdminUserDetailPage').then((m) => ({ default: m.AdminUserDetailPage }))
);
const AdminPaymentsPage = lazy(() =>
  import('./pages/admin/AdminPaymentsPage').then((m) => ({ default: m.AdminPaymentsPage }))
);
const AdminCouponsPage = lazy(() =>
  import('./pages/admin/AdminCouponsPage').then((m) => ({ default: m.AdminCouponsPage }))
);
const AdminReviewsPage = lazy(() =>
  import('./pages/admin/AdminReviewsPage').then((m) => ({ default: m.AdminReviewsPage }))
);
const AdminAnalyticsPage = lazy(() =>
  import('./pages/admin/AdminAnalyticsPage').then((m) => ({ default: m.AdminAnalyticsPage }))
);
const AdminSettingsPage = lazy(() =>
  import('./pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage }))
);

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <WishlistProvider>
            <Suspense
              fallback={
                <div className="py-24">
                  <LoadingState message="Loading SukhYatri experience…" />
                </div>
              }
            >
              <Routes>
                {/* Customer Routes with Global Layout */}
                <Route path="/" element={<CustomerLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="explore" element={<ExplorePage />} />
                  <Route path="destinations" element={<DestinationsPage />} />
                  <Route path="destination/:slug" element={<DestinationDetailPage />} />
                  <Route path="trip/:slug" element={<TripDetailPage />} />
                  <Route
                    path="booking/:tripId"
                    element={
                      <ProtectedRoute>
                        <BookingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="booking/success/:bookingId"
                    element={
                      <ProtectedRoute>
                        <TripConfirmationPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="signup" element={<SignupPage />} />
                  <Route path="verify-email" element={<VerifyEmailPage />} />
                  <Route path="verify" element={<VerifyEmailPage />} />
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="reset-password" element={<ResetPasswordPage />} />
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="my-trips"
                    element={
                      <ProtectedRoute>
                        <MyTripsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="my-trips/:bookingId"
                    element={
                      <ProtectedRoute>
                        <BookingDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* Admin Dashboard Routes Guarded by AdminRoute with Dedicated SaaS Admin Layout */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="bookings" element={<AdminBookingsPage />} />
                  <Route path="bookings/:id" element={<AdminBookingDetailPage />} />
                  <Route path="packages" element={<AdminPackagesPage />} />
                  <Route path="packages/new" element={<AdminPackageFormPage />} />
                  <Route path="packages/:id/edit" element={<AdminPackageFormPage />} />
                  <Route path="destinations" element={<AdminDestinationsPage />} />
                  <Route path="destinations/new" element={<AdminDestinationFormPage />} />
                  <Route path="destinations/:id/edit" element={<AdminDestinationFormPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="users/:id" element={<AdminUserDetailPage />} />
                  <Route path="payments" element={<AdminPaymentsPage />} />
                  <Route path="coupons" element={<AdminCouponsPage />} />
                  <Route path="reviews" element={<AdminReviewsPage />} />
                  <Route path="analytics" element={<AdminAnalyticsPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                  <Route path="*" element={<NotFoundPage type="admin" />} />
                </Route>
              </Routes>
            </Suspense>
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};
