import { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';

// Lazy load heavy components
export const AdminDashboard = lazy(() => import('./AdminDashboard'));
export const Profile = lazy(() => import('./Profile'));
export const PaymentSimulator = lazy(() => import('./PaymentSimulator'));
export const AdBannerManager = lazy(() => import('./AdBannerManager'));
export const AdminPanel = lazy(() => import('./AdminPanel'));

// Lazy load modals
export const EditProfileModal = lazy(() => import('./EditProfileModal'));
export const FollowersModal = lazy(() => import('./FollowersModal'));

// Create a reusable Suspense wrapper
export const LazyWrapper = ({ children, fallback = <div className="flex justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

LazyWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};
