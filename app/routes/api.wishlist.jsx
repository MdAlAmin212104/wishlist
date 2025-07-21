import { json } from "@remix-run/node";
import db from "../db.server";
import { cors } from "remix-utils/cors";

// --- GET: Fetch wishlist items for a customer ---
export async function loader({ request }) {
  const url = new URL(request.url);
  const customerId = url.searchParams.get("customerId");
  const shop = url.searchParams.get("shop");
  const productId = url.searchParams.get("productId");

  // Validate input
  if (!customerId || !shop || !productId) {
    return cors(
      request,
      json(
        {
          message: "Missing data. Required: customerId, productId, shop",
          method: "GET",
        },
        { status: 400 }
      )
    );
  }

  // Find wishlist item(s)
  try {
    const wishlist = await db.wishlist.findMany({
      where: {
        customerId,
        shop,
        productId,
      },
    });

    return cors(
      request,
      json({
        ok: true,
        message: "Success",
        data: wishlist,
      })
    );
  } catch (error) {
    return cors(
      request,
      json(
        {
          ok: false,
          message: "Error fetching wishlist",
          error: error.message,
        },
        { status: 500 }
      )
    );
  }
}

// --- POST: Perform create, delete, patch based on _action field ---
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const customerId = data.customerId;
  const productId = data.productId;
  const shop = data.shop;
  const _action = data._action;

  // Validate input
  if (!customerId || !productId || !shop || !_action) {
    return cors(
      request,
      json(
        {
          message: "Missing data. Required: customerId, productId, shop, _action",
          method: "POST",
        },
        { status: 400 }
      )
    );
  }

  try {
    let response;

    switch (_action) {
      case "CREATE": {
        const wishlist = await db.wishlist.create({
          data: {
            customerId,
            productId,
            shop,
          },
        });

        response = json({
          message: "Product added to wishlist",
          method: _action,
          wishlisted: true,
          wishlist,
        });
        break;
      }

      case "DELETE": {
        await db.wishlist.deleteMany({
          where: {
            customerId,
            shop,
            productId,
          },
        });

        response = json({
          message: "Product removed from wishlist",
          method: _action,
          wishlisted: false,
        });
        break;
      }

      case "PATCH": {
        // Add patch logic if needed later
        response = json({ message: "PATCH action is not implemented", method: _action });
        break;
      }

      default: {
        response = json({ message: "Invalid _action provided", method: _action }, { status: 400 });
        break;
      }
    }

    return cors(request, response);
  } catch (error) {
    console.error("Wishlist action error:", error);
    return cors(
      request,
      json(
        { message: "Server error", error: error.message },
        { status: 500 }
      )
    );
  }
}
