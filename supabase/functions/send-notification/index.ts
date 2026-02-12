import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// HTML entity escaping to prevent XSS in emails
const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

interface NotificationRequest {
  type: "contact" | "owner";
  data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message?: string;
    propertyAddress?: string;
    propertyType?: string;
    bedrooms?: string;
    currentlyRenting?: boolean;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const notificationEmail = Deno.env.get("NOTIFICATION_EMAIL") || "Michael@flagstaffescapes.com";

    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured, skipping email notification");
      return new Response(
        JSON.stringify({ message: "Email notifications not configured" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const resend = new Resend(resendApiKey);
    const { type, data }: NotificationRequest = await req.json();

    // Input validation
    if (!data || !data.name || !data.email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (typeof data.name !== "string" || data.name.length > 200) {
      return new Response(
        JSON.stringify({ error: "Invalid name" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof data.email !== "string" || !emailRegex.test(data.email) || data.email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (data.message && (typeof data.message !== "string" || data.message.length > 5000)) {
      return new Response(
        JSON.stringify({ error: "Invalid message" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/Phoenix",
      dateStyle: "full",
      timeStyle: "short",
    });

    let subject: string;
    let htmlContent: string;

    // Sanitize all user inputs before embedding in HTML
    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safePhone = data.phone ? escapeHtml(data.phone) : null;
    const safeSubject = data.subject ? escapeHtml(data.subject) : null;
    const safeMessage = data.message ? escapeHtml(data.message).replace(/\n/g, "<br>") : null;
    const safeAddress = data.propertyAddress ? escapeHtml(data.propertyAddress) : null;
    const safeType = data.propertyType ? escapeHtml(data.propertyType) : null;
    const safeBedrooms = data.bedrooms ? escapeHtml(data.bedrooms) : null;

    if (type === "owner") {
      subject = "New Owner Inquiry - Flagstaff Escapes";
      htmlContent = `
        <h1>New Owner Inquiry</h1>
        <p><strong>Submitted:</strong> ${timestamp}</p>
        <hr />
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        ${safePhone ? `<p><strong>Phone:</strong> <a href="tel:${safePhone}">${safePhone}</a></p>` : ""}
        <h2>Property Details</h2>
        ${safeAddress ? `<p><strong>Address:</strong> ${safeAddress}</p>` : ""}
        ${safeType ? `<p><strong>Type:</strong> ${safeType}</p>` : ""}
        ${safeBedrooms ? `<p><strong>Bedrooms:</strong> ${safeBedrooms}</p>` : ""}
        <p><strong>Currently Renting:</strong> ${data.currentlyRenting ? "Yes" : "No"}</p>
        ${safeMessage ? `<h2>Message</h2><p>${safeMessage}</p>` : ""}
      `;
    } else {
      subject = "New Contact Submission - Flagstaff Escapes";
      htmlContent = `
        <h1>New Contact Submission</h1>
        <p><strong>Submitted:</strong> ${timestamp}</p>
        <hr />
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        ${safePhone ? `<p><strong>Phone:</strong> <a href="tel:${safePhone}">${safePhone}</a></p>` : ""}
        ${safeSubject ? `<p><strong>Subject:</strong> ${safeSubject}</p>` : ""}
        ${safeMessage ? `<h2>Message</h2><p>${safeMessage}</p>` : ""}
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Flagstaff Escapes <noreply@flagstaffescapes.com>",
      to: [notificationEmail],
      subject,
      html: htmlContent,
      reply_to: data.email,
    });

    console.log("Email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: "An internal error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
