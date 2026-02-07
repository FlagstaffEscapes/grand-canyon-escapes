import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/Phoenix",
      dateStyle: "full",
      timeStyle: "short",
    });

    let subject: string;
    let htmlContent: string;

    if (type === "owner") {
      subject = "New Owner Inquiry - Flagstaff Escapes";
      htmlContent = `
        <h1>New Owner Inquiry</h1>
        <p><strong>Submitted:</strong> ${timestamp}</p>
        <hr />
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        ${data.phone ? `<p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ""}
        <h2>Property Details</h2>
        ${data.propertyAddress ? `<p><strong>Address:</strong> ${data.propertyAddress}</p>` : ""}
        ${data.propertyType ? `<p><strong>Type:</strong> ${data.propertyType}</p>` : ""}
        ${data.bedrooms ? `<p><strong>Bedrooms:</strong> ${data.bedrooms}</p>` : ""}
        <p><strong>Currently Renting:</strong> ${data.currentlyRenting ? "Yes" : "No"}</p>
        ${data.message ? `<h2>Message</h2><p>${data.message.replace(/\n/g, "<br>")}</p>` : ""}
      `;
    } else {
      subject = "New Contact Submission - Flagstaff Escapes";
      htmlContent = `
        <h1>New Contact Submission</h1>
        <p><strong>Submitted:</strong> ${timestamp}</p>
        <hr />
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        ${data.phone ? `<p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ""}
        ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ""}
        ${data.message ? `<h2>Message</h2><p>${data.message.replace(/\n/g, "<br>")}</p>` : ""}
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Flagstaff Escapes <noreply@flagstaffescapes.com>",
      to: [notificationEmail],
      subject,
      html: htmlContent,
      reply_to: data.email,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
