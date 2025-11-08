import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { getUserInfo, getRepoList, getRepoContents, createIssue } from "./Services/githubService.js";
import { supabase } from "./supabaseClient.js";
import { Octokit } from "@octokit/rest";

dotenv.config();
const app = express();

app.use(express.json({ verify: (req, res, buf) => (req.rawBody = buf) }));
app.use(cors({ origin: "*", credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboardcat",
    resave: false,
    saveUninitialized: true,
  })
);

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
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
  (req, res) => res.redirect(`http://localhost:5173/connections`)
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
); 

app.post("/api/supabase/saveConnection", async (req, res) => {
  try {
    const { pat, repo_owner, repo_name } = req.body;
    if (!pat || !repo_owner || !repo_name) {
      return res.status(400).json({ error: "Missing data fields" });
    }
    const { data, error } = await supabase
      .from("github_connections")
      .insert([
        {
          pat: pat,
          repo_owner: repo_owner,
          repo_name: repo_name,
        },
      ]);
    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: "Connection saved!", data });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server Failed" });
  }
});

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "http://localhost:3000/login" }),
  (req, res) => res.redirect(`http://localhost:5173/connections`)
);

app.post("/api/github/userInfo", async (req, res) => {
  const pat = req.body.personal_access_token;
  const info = await getUserInfo(pat);
  res.json(info);
});

app.post("/api/github/repos", async (req, res) => {
   const PAT = req.body.personal_access_token; 
   const repos = await getRepoList(PAT); 
   res.json(repos); 
  });

async function fetchCrispLogs(owner, repo, runId, token) {
  const octokit = new Octokit({ auth: token });

  const ignorePatterns = [
    /tar/i, /cached/i, /cache/i, /warning/i, /notice/i,
    /upload/i, /download/i, /github/i, /actions/i,
    /node:internal/i, /restore/i, /Preparing/i, /Completed/i
  ];

  try {
    const { data: jobData } = await octokit.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: runId,
    });

    let rootCause = "Unknown failure";
    let errors = [];
    let failedStep = "Unknown Step";

    for (const job of jobData.jobs) {
      if (job.conclusion !== "failure") continue;

      const step = job.steps.find((s) => s.conclusion === "failure");
      if (step) failedStep = step.name;

      const response = await octokit.actions.downloadJobLogsForWorkflowRun({
        owner,
        repo,
        run_id: runId,
        job_id: job.id,
        headers: { Accept: "application/vnd.github.v3.raw" },
      });

      const logText = Buffer.from(response.data).toString("utf8");
      const lines = logText.split("\n");

      for (const line of lines) {
        if (ignorePatterns.some((p) => p.test(line))) continue;

        if (/error|fail|not found|exit 1|undefined|exception/i.test(line)) {
          errors.push(line.trim());
        }
      }
    }

    if (errors.length > 0) rootCause = errors[0];

    const result = {
      status: "failure",
      failedStep,
      rootCause,
      sampleErrors: errors.slice(0, 5),
    };

    console.log("Extracted CI Failure →", result);
    return result;
  } catch (err) {
    console.error("Log Fetch Error:", err.response?.data || err.message);
    return { message: "Failed to fetch crisp error logs" };
  }
}

app.post("/api/github/webhook", async (req, res) => {
  const eventType = req.headers["x-github-event"];
  const payload = req.body;

  console.log(`Event → ${eventType}`);

  if (eventType === "workflow_run" && payload.action === "completed") {
    const { conclusion, id: runId } = payload.workflow_run;
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;

    console.log("Status:", conclusion);
    console.log("Run ID:", runId);

    if (conclusion !== "success") {
      console.log("Fetching crisp CI logs…");
      const logs = await fetchCrispLogs(owner, repo, runId, process.env.GITHUB_TOKEN);
      console.log("Final Logs →", logs);
    }
  }

  res.status(200).send("OK");
});

app.listen(5000, () =>
  console.log("Server running → http://localhost:5000")
);
