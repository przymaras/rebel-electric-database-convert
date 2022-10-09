import type { Request, Response } from "express";

import ImageKit from "imagekit";

import { errorImages1 } from "../uploadResults1";

export const uploadVehicleImagesRetry = async (req: Request, res: Response) => {
  const imagekit: ImageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ?? "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY ?? "",
    urlEndpoint: "https://ik.imagekit.io/rebelelectric/",
  });

  try {
    const uploadedImages: number[] = [];
    const errorImages: number[] = [];

    await Promise.allSettled(
      errorImages1.map((photoId) => {
        return imagekit
          .upload({
            file: `https://bikel.pl/rebel/${photoId}`, //required
            fileName: `v1-${photoId}.jpg`, //required
            folder: "/v1",
            useUniqueFileName: false,
          })
          .then(() => {
            uploadedImages.push(photoId);
            console.info(`Uploaded: ${photoId}`);
          })
          .catch(() => {
            errorImages.push(photoId);
            console.error(`Error upload: ${photoId}`);
          });
      })
    );

    errorImages.sort((a, b) => a - b);
    uploadedImages.sort((a, b) => a - b);

    return res.status(200).json({ message: "Upload results", errorImages, uploadedImages });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : err,
    });
  }
};
