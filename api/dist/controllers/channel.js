"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannelDetails = exports.createChannel = void 0;
const db_1 = require("../db/db");
const createChannel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, description, slug } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(403).json({ message: "User is not authenticated" });
        return;
    }
    if (!name || !description || !slug) {
        res.status(400).json({
            message: "Validation errors"
        });
    }
    try {
        const existingChannel = yield db_1.prisma.channel.findUnique({
            where: {
                slug
            }
        });
        if (existingChannel) {
            res.status(409).json({
                message: "Slug already exists"
            });
            return;
        }
        const userChannel = yield db_1.prisma.channel.findUnique({
            where: {
                userId
            }
        });
        if (userChannel) {
            res.status(411).json({
                error: "User already has a channel"
            });
            return;
        }
        console.log({
            name,
            description,
            slug,
            userId
        });
        const channel = yield db_1.prisma.channel.create({
            data: {
                name,
                description,
                slug,
                userId
            }
        });
        res.status(200).json({
            message: "Channel successfully created"
        });
    }
    catch (error) {
        res.status(500).json({
            error
        });
    }
});
exports.createChannel = createChannel;
const getChannelDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    try {
        const channel = yield db_1.prisma.channel.findUnique({
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
        });
        if (!channel) {
            res.status(404).json({
                error: "Channel not found"
            });
        }
        const response = {
            id: channel === null || channel === void 0 ? void 0 : channel.id,
            name: channel === null || channel === void 0 ? void 0 : channel.name,
            description: channel === null || channel === void 0 ? void 0 : channel.description,
            videos: channel === null || channel === void 0 ? void 0 : channel.videos.map((video) => ({
                id: video.id,
                title: video.title,
                thumbnail_url: video.thumbnailUrl
            }))
        };
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            error: error
        });
    }
});
exports.getChannelDetails = getChannelDetails;
