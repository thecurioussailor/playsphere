import { Router } from "express"
import { createUser, userLogin} from "../controllers/auth";
import { getVideoDetails, getVideoFeed, updateTimeStramp, uploadVideo } from "../controllers/video";
import { createChannel, getChannelDetails } from "../controllers/channel";
import { authenticate } from "../middlewares/auth";
const router = Router();

//authentication routes
router.post("/auth/signup", createUser);
router.post("/auth/login", userLogin);
router.get("/videos/feed", getVideoFeed);
//channel
router.post("/channels", authenticate,createChannel);
router.get("/channels/:slug",authenticate, getChannelDetails);
//video 
router.post("/videos/upload",authenticate, uploadVideo);
router.get("/videos/:videoId", getVideoDetails);
router.put("/videos/:videoId/time", updateTimeStramp);

export default router;