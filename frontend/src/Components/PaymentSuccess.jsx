import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaCrown } from "react-icons/fa";
import { useAuthContext } from "../context/AuthContext";
import useAPICall from "../api/useAPICall";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authUser, setAuthUser } = useAuthContext();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const callAPI = useAPICall();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const oid = searchParams.get('oid');
        const amt = searchParams.get('amt');
        const refId = searchParams.get('refId');

        // For eSewa test environment, these parameters might be different
        // Check for alternative parameter names
        const transactionId = oid || searchParams.get('pid');
        const amount = amt || searchParams.get('tAmt') || '100';
        const referenceId = refId || searchParams.get('rid');

        if (!transactionId) {
          setVerificationStatus('invalid');
          setIsVerifying(false);
          return;
        }

        // Verify payment with backend
        const response = await callAPI('payment/verify-esewa', 'POST', {
          oid: transactionId,
          amt: amount,
          refId: referenceId || 'test-ref-' + Date.now(),
          userId: authUser._id
        });

        if (response.success) {
          // Update user's ad-free status with complete user data from backend
          const updatedUser = { ...authUser, ...response.user };
          setAuthUser(updatedUser);
          localStorage.setItem('xCloneUser', JSON.stringify(updatedUser));
          setVerificationStatus('success');
        } else {
          setVerificationStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        setVerificationStatus('failed');
      } finally {
        setIsVerifying(false);
      }
    };

    if (authUser) {
      verifyPayment();
    }
  }, [searchParams, authUser, setAuthUser, callAPI]);

  const handleContinue = () => {
    navigate('/');
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-xl">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Congratulations! You&apos;ve successfully removed ads from your Twitter experience.
          </p>

          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white mb-6">
            <div className="flex items-center justify-center mb-2">
              <FaCrown className="text-2xl mr-2" />
              <span className="font-bold text-lg">Premium User</span>
            </div>
            <p className="text-sm opacity-90">You now have an ad-free experience!</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <span className="mr-2">✨</span>
              <span>No more banner advertisements</span>
            </div>
            <div className="flex items-center justify-center text-sm text-gray-600">
              <span className="mr-2">🚀</span>
              <span>Faster and cleaner browsing</span>
            </div>
            <div className="flex items-center justify-center text-sm text-gray-600">
              <span className="mr-2">💎</span>
              <span>Premium user status activated</span>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Twitter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-red-500 text-4xl">❌</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Verification Failed</h1>
        <p className="text-gray-600 mb-6">
          We couldn&apos;t verify your payment. Please try again or contact support.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
