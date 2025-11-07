import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { getUserInfo } from "./Services/githubService.js";
import {getRepoList} from"./Services/githubService.js";
import { getRepoContents } from "./Services/githubService.js";
import { createIssue } from "./Services/githubService.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(session({ 
  secret: process.env.SESSION_SECRET || "keyboardcat", 
  resave: false, 
  saveUninitialized: true 
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => done(null, profile)
  )
);

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
  (req, res) => {
    res.redirect(`http://localhost:5173/connections`);
  }
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => done(null, profile)
  )
);

app.get("/auth/github",
  passport.authenticate("github")
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "http://localhost:3000/login" }),
  (req, res) => {
    res.redirect(`http://localhost:5173/connections`);
  }
);

app.post("/api/github/userInfo",async (req,res)=>{
    const PAT=req.body.personal_access_token;
    res.json({message:`GitHub connected with PAT successfully.`});
    const UserInfo=await getUserInfo(PAT);
    console.log("GitHub User Info:",UserInfo);
})

app.post("/api/github/repos",async(req,res)=>{
    const PAT=req.body.personal_access_token;
    const repos=await getRepoList(PAT);
    res.json(repos);
})

app.post("/api/github/repoContents",async(req,res)=>{
    const {personal_access_token, owner, repo, filepath}=req.body;
    const content=await getRepoContents(personal_access_token, owner, repo, filepath);
    res.json(content);
})

app.post("/api/github/createIssue",async(req,res)=>{
    const {personal_access_token, owner, repo, title, body}=req.body;
    const issue=await createIssue(personal_access_token, owner, repo, title, body);
    res.json(issue);
});


app.listen(5000, () => console.log("OAuth Server running on http://localhost:5000"));
