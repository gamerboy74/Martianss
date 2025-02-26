import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { RegistrationFormData } from "../types/registration";
import { useRegistration } from "../hooks/useRegistration";
import { useApp } from "../context/AppContext";
import RegistrationForm from "./RegistrationForm";
import CheckoutPage from "./CheckoutPage";

const BGMIRegistration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSubmitting, submitRegistration } = useRegistration();
  const { addNotification } = useApp();
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData | null>(null);

  const tournamentId = location.state?.tournamentId;
  const registrationFee = 500; // INR
  const upiId = "yourbusiness@upi"; // Replace with your UPI ID
  const qrCodeUrl = "/path-to-your-qr-code.png"; // Replace with your QR code

  if (!tournamentId) return <Navigate to="/" />;

  const sendConfirmationEmail = async (email: string, fullName: string, teamName: string) => {
    const payload = { email, fullName, teamName, tournamentId };
    try {
      const response = await fetch(
        "https://gvmsopxbjhntcublylxu.supabase.co/functions/v1/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("Failed to send confirmation email");
    } catch (error) {
      console.error("Email sending failed:", error);
      addNotification({
        id: Date.now().toString(),
        type: "error",
        message: "Registration successful, but failed to send confirmation email.",
      });
    }
  };

  const handleFormSubmit = (data: RegistrationFormData) => {
    setFormData(data);
    setShowCheckout(true);
  };

  const handlePaymentConfirmation = async () => {
    if (!formData) return;
    try {
      await submitRegistration(formData, tournamentId);
      await sendConfirmationEmail(
        formData.personalInfo.email,
        formData.personalInfo.fullName,
        formData.teamDetails.teamName
      );
      navigate("/registration-success");
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        type: "error",
        message: error instanceof Error ? error.message : "Registration failed.",
      });
    }
  };

  return showCheckout ? (
    <CheckoutPage
      fee={registrationFee}
      upiId={upiId}
      qrCodeUrl={qrCodeUrl}
      tournamentId={tournamentId}
      onConfirm={handlePaymentConfirmation}
      onBack={() => setShowCheckout(false)}
      isSubmitting={isSubmitting}
    />
  ) : (
    <RegistrationForm
      tournamentId={tournamentId}
      onSubmit={handleFormSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default BGMIRegistration;