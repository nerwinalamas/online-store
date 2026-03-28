import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, type, name, phone, email, orderId } =
      await req.json();

    const PAYMONGO_SECRET = process.env.PAYMONGO_SECRET_KEY;

    if (!PAYMONGO_SECRET) {
      return NextResponse.json(
        { message: "PayMongo secret key not configured." },
        { status: 500 },
      );
    }

    // Convert amount to centavos (PayMongo uses the smallest currency unit)
    const amountInCentavos = Math.round(amount * 100);

    // Step 1: Create a PayMongo Source
    const sourceRes = await fetch("https://api.paymongo.com/v1/sources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET + ":").toString(
          "base64",
        )}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: amountInCentavos,
            currency: currency || "PHP",
            type: type, // "gcash" or "maya"
            redirect: {
              success: `${process.env.NEXT_PUBLIC_BASE_URL}/success?orderId=${orderId}`,
              failed: `${process.env.NEXT_PUBLIC_BASE_URL}/payment?orderId=${orderId}&failed=true`,
            },
            billing: {
              name,
              phone,
              email,
            },
          },
        },
      }),
    });

    const sourceData = await sourceRes.json();

    if (!sourceRes.ok) {
      const errorMsg =
        sourceData?.errors?.[0]?.detail || "Failed to create payment source.";
      return NextResponse.json({ message: errorMsg }, { status: 400 });
    }

    const redirectUrl = sourceData?.data?.attributes?.redirect?.checkout_url;

    if (!redirectUrl) {
      return NextResponse.json(
        { message: "No redirect URL returned from PayMongo." },
        { status: 500 },
      );
    }

    return NextResponse.json({ redirectUrl, sourceId: sourceData.data.id });
  } catch (err) {
    console.error("PayMongo error:", err);
    return NextResponse.json(
      { message: err || "Internal server error" },
      { status: 500 },
    );
  }
}
