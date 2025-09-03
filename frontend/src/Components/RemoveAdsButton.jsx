import { useState } from "react";
import { FaShieldAlt, FaCrown, FaTimes } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";
import CryptoJS from 'crypto-js';

const RemoveAdsButton = () => {
  const { authUser } = useAuthContext();
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Don't show the button if user is admin or already has ads disabled
  if (!authUser || authUser.isAdmin || authUser.showAds === false) {
    return null;
  }

  const handleRemoveAds = () => {
    setShowModal(true);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Generate unique transaction UUID
      const transactionUuid = `ad-removal-${authUser._id}-${Date.now()}`;
      
      // eSewa v2 API Configuration
      const amount = 100;
      const tax_amount = 0;
      const total_amount = amount + tax_amount;
      const product_service_charge = 0;
      const product_delivery_charge = 0;
      const product_code = "EPAYTEST";
      const success_url = `${window.location.origin}/payment/success?oid=${transactionUuid}&amt=${total_amount}`;
      const failure_url = `${window.location.origin}/payment/failure?oid=${transactionUuid}&amt=${total_amount}`;
      
      // Generate signature for eSewa v2
      const signed_field_names = "total_amount,transaction_uuid,product_code";
      const secret_key = "8gBm/:&EnhH.1/q"; // eSewa test secret key
      const message = `total_amount=${total_amount},transaction_uuid=${transactionUuid},product_code=${product_code}`;
      const signature = CryptoJS.HmacSHA256(message, secret_key).toString(CryptoJS.enc.Base64);

      const paymentData = {
        amount: amount,
        tax_amount: tax_amount,
        total_amount: total_amount,
        transaction_uuid: transactionUuid,
        product_code: product_code,
        product_service_charge: product_service_charge,
        product_delivery_charge: product_delivery_charge,
        success_url: success_url,
        failure_url: failure_url,
        signed_field_names: signed_field_names,
        signature: signature
      };

      // Create form and submit to eSewa v2 API
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

      Object.keys(paymentData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Payment initialization failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Remove Ads Button */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 mb-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaShieldAlt className="text-2xl mr-3" />
            <div>
              <h3 className="font-bold text-lg">Go Ad-Free!</h3>
              <p className="text-sm opacity-90">Remove all ads for just ₹100</p>
            </div>
          </div>
          <FaCrown className="text-2xl opacity-75" />
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center text-sm">
            <span className="mr-2">✨</span>
            <span>No more banner ads</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-2">🚀</span>
            <span>Faster browsing experience</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-2">💎</span>
            <span>Premium user status</span>
          </div>
        </div>

        <button
          onClick={handleRemoveAds}
          className="w-full mt-4 bg-white text-purple-600 font-bold py-2 px-4 rounded-full hover:bg-gray-100 transition-colors"
        >
          Remove Ads - ₹100
        </button>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Remove Ads</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Go Premium!</h3>
              <p className="text-gray-600 mb-4">
                Remove all ads and enjoy a cleaner Twitter experience for just ₹100.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Ad Removal Service</span>
                  <span className="font-semibold">₹100</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Payment Method</span>
                  <div className="flex items-center">
                    <img 
                      src="https://esewa.com.np/common/images/esewa_logo.png" 
                      alt="eSewa" 
                      className="h-6 mr-2"
                    />
                    <span>eSewa</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Pay with eSewa - ₹100"
                )}
              </button>
              
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>Secure payment powered by eSewa</p>
              <p>Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RemoveAdsButton;
