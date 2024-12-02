import { SIGNATURE_HEADER_NAME, isValidSignature } from "@sanity/webhook";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const signature = req.headers[SIGNATURE_HEADER_NAME]?.toString() || "";
    if (
      !isValidSignature(
        JSON.stringify(req.body),
        signature,
        process.env.SANITY_WEBHOOK_ISR_ON_DEMAND_SECRET || ""
      )
    )
      return res.status(401).json({ message: "Invalid signature" });
    const { slug } = req.body;
    await res.revalidate(`/blog/posts/${slug}`);
    await res.revalidate(`/blog/`);
    console.log("slug", slug);
    res.status(200).json({ message: "Revalidation request sent" });
  } catch (error) {
    res.status(200).json({ error: "something went wrong", message: error });
  }
};

export default handler;
