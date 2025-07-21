import { json } from "@remix-run/node";
import { cors } from "remix-utils/cors";
import db from "../db.server";

// Handle GET requests (e.g., to prevent or support them)
export async function loader({ request }) {
  return cors(
    request,
    json({ message: "GET method not allowed on this endpoint" }, { status: 405 })
  );
}

export async function action({ request }) {
  const method = request.method;

  if (method === "POST") {
    let formData = await request.formData();
    const data = Object.fromEntries(formData);
    const { customerId, productId, shop } = data;

    if (!customerId || !productId || !shop) {
      return cors(
        request,
        json(
          {
            message: "Missing data. Required: customerId, productId, shop",
            method,
          },
          { status: 400 }
        )
      );
    }

    try {
      const wishlist = await db.wishlist.create({
        data: {
          customerId,
          productId,
          shop,
        },
      });

      return cors(
        request,
        json({
          message: "Product added to wishlist",
          method: "POST",
          wishlist,
        })
      );
    } catch (error) {
      console.error("Wishlist creation error:", error);
      return cors(
        request,
        json(
          { message: "Failed to add to wishlist", error: error.message },
          { status: 500 }
        )
      );
    }
  }

  if (method === "PATCH") {
    return cors(request, json({ message: "PATCH not implemented yet", method }));
  }

  return new Response("Method Not Allowed", { status: 405 });
}
