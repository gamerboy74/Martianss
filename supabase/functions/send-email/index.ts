// supabase/functions/send-email/index.ts
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Or 'http://localhost:5173' for dev
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { email, fullName, teamName, tournamentId } = await req.json();

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Registration Received - BGMI Tournament',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #800080;">Registration Confirmation</h2>
          <p>Dear ${fullName},</p>
          <p>Thank you for registering for the BGMI Tournament! We have successfully received your registration with the following details:</p>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Team Name:</strong> ${teamName}</li>
            <li><strong>Tournament ID:</strong> ${tournamentId}</li>
          </ul>
          <p>We will review your application and send you further details soon.</p>
          <p>Best regards,<br>The BGMI Tournament Team</p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});