import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/api/db";
import { Session } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  if (!session?.user?.email) {
    return res.status(401).json({ response: "You must be logged in." });
  }

  const email: string = session.user.email;
  const collectionName: string = req?.body?.collectionName;

  if (!collectionName) {
    return res
      .status(401)
      .json({ response: "Please enter a valid name for the collection." });
  }

  const findCollection = await prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      collections: {
        where: {
          name: collectionName,
        },
      },
    },
  });

  const checkIfCollectionExists = findCollection?.collections[0];

  if (checkIfCollectionExists) {
    return res.status(400).json({ response: "Collection already exists." });
  }

  const createCollection = await prisma.collection.create({
    data: {
      owner: {
        connect: {
          id: session.user.id,
        },
      },
      name: collectionName,
    },
  });

  return res.status(200).json({
    response: createCollection,
  });
}