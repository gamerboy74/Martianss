// supabase/functions/send-status-update/index.ts
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { Resend } from "https://esm.sh/resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:5173", // Adjust for production
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { email, fullName, teamName, tournamentId, status } = await req.json();

    // Validate required fields
    if (!email || !fullName || !teamName || !tournamentId || !status) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!["approved", "rejected"].includes(status)) {
      return new Response(JSON.stringify({ error: "Invalid status" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const statusMessage =
      status === "approved"
        ? "Congratulations! Your team has been approved for the BGMI Tournament. Get ready to compete!"
        : "We regret to inform you that your team has been rejected for the BGMI Tournament.";

    await resend.emails.send({
      from: "onboarding@resend.dev", // Use your verified domain in production
      to: email,
      subject: `BGMI Tournament Registration Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #800080;">Registration Status Update</h2>
          <p>Dear ${fullName},</p>
          <p>${statusMessage}</p>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Team Name:</strong> ${teamName}</li>
            <li><strong>Tournament ID:</strong> ${tournamentId}</li>
          </ul>
          <p>For any questions, please reply to this email or contact our support team.</p>
          <p>Best regards,<br>The BGMI Tournament Team</p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ message: "Status update email sent successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Status update email failed:", error);
    return new Response(JSON.stringify({ error: "Failed to send status update email" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});