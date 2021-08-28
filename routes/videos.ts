import { Router } from "express";
import passport from "passport";

const router = Router();

import { allVideos,  videoData, video, videoPoster, searchVideos } from "../controllers/videos";

router.get(
  "/videos",
  passport.authenticate("jwt",{session:false}),
  allVideos
);

router.get(
  "/video/:id/data",
  passport.authenticate("jwt",{session:false}),
  videoData
)

router.get(
  "/video/:id",
  passport.authenticate("jwt",{session:false}),
  video
)

router.get(
  "/video/:id/poster",
  passport.authenticate("jwt",{session:false}),
  videoPoster
)

router.get(
  "/videos/search/:query",
  passport.authenticate("jwt",{session:false}),
  searchVideos
)

export default router;