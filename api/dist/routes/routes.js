"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const video_1 = require("../controllers/video");
const channel_1 = require("../controllers/channel");
const auth_2 = require("../middlewares/auth");
const router = (0, express_1.Router)();
//authentication routes
router.post("/auth/signup", auth_1.createUser);
router.post("/auth/login", auth_1.userLogin);
router.get("/videos/feed", video_1.getVideoFeed);
//channel
router.post("/channels", auth_2.authenticate, channel_1.createChannel);
router.get("/channels/:slug", auth_2.authenticate, channel_1.getChannelDetails);
//video 
router.post("/videos/upload", auth_2.authenticate, video_1.uploadVideo);
router.get("/videos/:videoId", video_1.getVideoDetails);
router.put("/videos/:videoId/time", video_1.updateTimeStramp);
exports.default = router;
