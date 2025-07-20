import { json } from "@remix-run/node";
import { cors } from "remix-utils/cors";

import db from "../db.server"

export async function action({ request }) {
  const method = request.method;
  let data = await request.formData();
  data = Object.fromEntries(data);
  const customerId = data.customerId;
  const productId = data.productId;
  const shop = data.shop;


  if (!customerId || !productId || !shop) {
    return json({
      message: "Missing data. Required: customerId, productId, shop",
      method,
    });
  }

  switch (method) {
    case "POST":
      const wishlist = await db.wishlist.create({
        data: {
          customerId,
          productId,
          shop,
        },
      });

      const response = json({
        message: "Product added to wishlist",
        method: "POST",
        wishlist,
      });

      // eslint-disable-next-line no-undef
      return cors(request, response); // assuming cors is defined
    case "PATCH":
      return json({ message: "Success", method: "PATCH" });
    default:
      return new Response("Method Not Allowed", { status: 405 });
  }
}
