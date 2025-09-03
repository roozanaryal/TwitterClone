import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaArrowLeft, FaRedo } from "react-icons/fa";

const PaymentFailure = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-xl">
        <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaExclamationTriangle className="text-red-500 text-4xl" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          Your payment could not be processed. This might be due to insufficient balance, 
          network issues, or payment cancellation.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">What you can do:</h3>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>• Check your eSewa balance</li>
            <li>• Ensure stable internet connection</li>
            <li>• Try the payment again</li>
            <li>• Contact eSewa support if issues persist</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <FaRedo className="mr-2" />
            Try Payment Again
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Need help? Contact our support team</p>
          <p>Payment ID: {new Date().getTime()}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
