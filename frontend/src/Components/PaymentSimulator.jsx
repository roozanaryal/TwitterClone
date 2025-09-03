import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaCreditCard, FaShieldAlt } from "react-icons/fa";

const PaymentSimulator = () => {
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Extract payment data from URL parameters - match eSewa v2 format
    const amount = searchParams.get('amount') || '100';
    const total_amount = searchParams.get('total_amount') || amount;
    const transaction_uuid = searchParams.get('transaction_uuid') || 'test-transaction';
    const product_code = searchParams.get('product_code') || 'EPAYTEST';
    const success_url = searchParams.get('success_url') || '';
    const failure_url = searchParams.get('failure_url') || '';

    setPaymentData({ 
      amount, 
      total_amount, 
      transaction_uuid, 
      product_code, 
      success_url, 
      failure_url 
    });
  }, [searchParams]);

  const handlePaymentSuccess = () => {
    setIsProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      const successUrl = new URL(paymentData.success_url);
      successUrl.searchParams.set('oid', paymentData.transaction_uuid);
      successUrl.searchParams.set('amt', paymentData.total_amount);
      successUrl.searchParams.set('refId', `simulator-${Date.now()}`);
      
      window.location.href = successUrl.toString();
    }, 2000);
  };

  const handlePaymentFailure = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const failureUrl = new URL(paymentData.failure_url);
      failureUrl.searchParams.set('oid', paymentData.transaction_uuid);
      failureUrl.searchParams.set('amt', paymentData.total_amount);
      
      window.location.href = failureUrl.toString();
    }, 1000);
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="text-green-600 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">eSewa Payment Simulator</h1>
          <p className="text-gray-600 text-sm mt-2">Test Environment - No Real Money</p>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Payment Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold">₹{paymentData.total_amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-xs">{paymentData.transaction_uuid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Merchant Code:</span>
              <span className="font-mono text-xs">{paymentData.product_code}</span>
            </div>
          </div>
        </div>

        {/* Test Credentials Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-800 mb-2">Test Credentials</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>eSewa ID:</strong> 9806800001</p>
            <p><strong>Password:</strong> Nepal@123</p>
            <p><strong>MPIN:</strong> 1122</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handlePaymentSuccess}
            disabled={isProcessing}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <>
                <FaCreditCard className="mr-2" />
                Simulate Successful Payment
              </>
            )}
          </button>
          
          <button
            onClick={handlePaymentFailure}
            disabled={isProcessing}
            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Simulate Failed Payment
          </button>
          
          <button
            onClick={() => window.history.back()}
            disabled={isProcessing}
            className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel Payment
          </button>
        </div>

        {/* Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This is a payment simulator for testing purposes only.
            <br />
            No actual payment will be processed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSimulator;
