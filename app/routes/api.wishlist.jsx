import { json } from "@remix-run/node";

export async function loader() {
  let settings = {
    name: "My app",
    description: "My app description",
    
  };
  return json(settings);
}


export async function action({ request}){
    const method = request.method;

    switch(method){
        case "POST":
            // Handle POST reqeuest locig here
            // For example, adding a new item to the wishlist
            return json({message : "Success", method: "POST"});
        case "PATCH":
            // Handle POST reqeuest locig here
            // For example, adding a new item to the wishlist\
            return json ({message: "Success", method: "PATCH"})
        default:
            // optional: handle other methods or return a method not allowed response
            return new Response("Method Not Allowed", {status: 405});
    }
    
}