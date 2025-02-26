import React from "react";
import { CreditCard, CheckCircle } from "lucide-react";

interface CheckoutPageProps {
  fee: number;
  upiId: string;
  qrCodeUrl: string;
  tournamentId: string;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  fee,
  upiId,
  qrCodeUrl,
  tournamentId,
  onConfirm,
  onBack,
  isSubmitting,
}) => (
  <section className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black pointer-events-none" />
    <div className="max-w-2xl mx-auto relative">
      <div className="bg-purple-900/20 backdrop-blur-sm rounded-xl p-8 text-center">
        <CreditCard className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Complete Your Payment</h2>
        <p className="text-gray-300 mb-6">
          Registration Fee: <span className="text-purple-400">₹{fee}</span>
        </p>

        <div className="space-y-6">
          <div>
            <img src={qrCodeUrl} alt="UPI QR Code" className="w-48 h-48 mx-auto rounded-lg border border-purple-500/30" />
            <p className="text-gray-300 mt-4">Scan to Pay</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Or send to UPI ID:</p>
            <p className="text-lg font-medium text-purple-400">{upiId}</p>
          </div>
          <div className="text-left text-sm text-gray-400 bg-black/50 p-4 rounded-lg">
            <p>Steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open your UPI app (Google Pay, PhonePe, etc.)</li>
              <li>Scan the QR code or enter the UPI ID</li>
              <li>Enter ₹{fee} and add "Tournament {tournamentId}" in remarks</li>
              <li>Send the payment</li>
            </ol>
          </div>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5" />
            {isSubmitting ? "SUBMITTING..." : "I’ve Paid - Submit Registration"}
          </button>
          <button
            onClick={onBack}
            className="w-full py-3 bg-transparent border border-purple-500/50 hover:bg-purple-500/10 rounded-lg text-purple-400 font-medium"
          >
            Back to Form
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default CheckoutPage;