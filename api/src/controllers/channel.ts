import { Request, Response } from "express"
import { prisma } from "../db/db"
  
export const createChannel = async (req: Request, res: Response) => {
    const {name, description, slug} = req.body;

    const userId = req.user?.id;
    if (!userId) {
      res.status(403).json({ message: "User is not authenticated" });
      return
    }

    if(!name || !description || !slug){
        res.status(400).json({
            message: "Validation errors"
        })
    }
    try{
        const existingChannel = await prisma.channel.findUnique({
            where: {
                slug
            }
        })

        if(existingChannel){
            res.status(409).json({
                message: "Slug already exists"
            })
            return
        }

        const userChannel = await prisma.channel.findUnique({
            where: {
                userId
            }
        })

        if(userChannel){
            res.status(411).json({
                error: "User already has a channel"
            })
            return
        }

        console.log({
            name,
            description,
                slug,
                userId
        })
        const channel = await prisma.channel.create({
            data: {
                name,
                description,
                slug,
                userId
            }
        })

        res.status(200).json({
            message: "Channel successfully created"
        })

    }catch (error) {
        res.status(500).json({
            error
        })
    }
}

export const getChannelDetails = async (req: Request, res: Response) => {
    const { slug } = req.params;

    try{
        const channel = await prisma.channel.findUnique({
            where: {
                slug
            },
            select: {
                id: true,
                name: true,
                description: true,
                videos: {
                    select: {
                        id: true,
                        title: true,
                        thumbnailUrl: true
                    }
                },
                _count: {
                    select: { videos: true }, // If you want to calculate subscriber count or related stats, adjust here
                },
            }
        })

        if(!channel){
            res.status(404).json({
                error: "Channel not found"
            })
        }

        const response = {
            id: channel?.id,
            name: channel?.name,
            description: channel?.description,
            videos: channel?.videos.map((video) => ({
                id: video.id,
                title: video.title,
                thumbnail_url: video.thumbnailUrl
            }))
        }
        res.status(200).json(response)
    }catch (error){
        res.status(500).json({
            error: error
        })
    }
}