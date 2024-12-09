import { Request, Response } from "express";
import multer from "multer";
import { prisma } from "../db/db";
export const getVideoFeed = async(req: Request, res: Response) => {
    
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
})

const upload = multer({storage: storage});

export const uploadVideo = async (req: Request, res: Response) => {
    const { title, description, category, channelId } = req.body;
    const file = req.file;
    try {
        const video = await prisma.video.create({
          data: {
            title,
            description,
            fileUrl: file.path,
            channelId,
          },
        });
    
        res.status(201).json(video)
    }catch(error) {
        res.status(500).json({
            error
        })
    }
}

export const getVideoDetails = async (req: Request, res: Response) => {
    const { videoId } = req.params;

  try {
    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video){
        res.status(404).json({ error: "Video not found" });
        return
    } 

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

export const updateTimeStramp = async (req: Request, res: Response) => {
    const { videoId } = req.params;
  const { timestamp } = req.body;

  try {
    const video = await prisma.video.update({
      where: { id: videoId },
      data: { currentTimestamp:  timestamp},
    });

    res.status(200).json(video);
  } catch (error) {
    res.status(400).json({ error: "Invalid timestamp" });
  }
}