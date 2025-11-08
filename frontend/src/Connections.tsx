import React, { use, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./WebHookSetup";

export default function Connections() {
  const navigate = useNavigate();
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [pat, setPat] = useState("");
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [loadingRepos, setLoadingRepos] = useState(false);

  type Integration = "github" | "prometheus" | "slack";

  const handleCheckbox = (integration: Integration): void => {
    setSelectedIntegration(integration);
    setRepos([]);
    setSelectedRepo(null);
  };

  const handleContinue = () => {
    if (!selectedIntegration) {
      alert("Please select one integration first before continuing.");
      return;
    }
    setShowModal(true);
  };
  const fetchRepos = async () => {
    try {
      setLoadingRepos(true);
      const res = await fetch("http://localhost:5000/api/github/repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personal_access_token: pat }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setRepos(data);
    } catch (err) {
      alert("Failed to fetch repo list. Please check your PAT.");
      console.error(err);
    } finally {
      setLoadingRepos(false);
    }
  };

const handleSubmit = async (e: any) => {
  e.preventDefault();

  if (selectedIntegration === "github") {
    if (!selectedRepo) return alert("Please select a repository!");

    let repoObj: any;
    try {
      repoObj = JSON.parse(selectedRepo);
    } catch (err) {
      console.error("Failed to parse selectedRepo", err);
      return alert("Invalid repository selected.");
    }

    const body = {
      pat: pat,
      repo_owner: repoObj.owner,
      repo_name: repoObj.name,
    };

    const res = await fetch("http://localhost:5000/api/supabase/saveConnection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      alert("GitHub Connected Successfully & Saved!");
      localStorage.setItem("selectedRepo", JSON.stringify(repoObj));
      navigate("/webhooksetup");
    } else {
      alert("Failed: " + data.error);
    }
  }

  setShowModal(false);
};



  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Manage Your Connections</h1>
        <h2 className="text-lg text-gray-700 mb-6">
          Where do you want FixFlow to start helping?
        </h2>

        <div className="flex flex-col gap-4 text-left">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIntegration === "github"}
              onChange={() => handleCheckbox("github")}
              className="w-5 h-5"
            />
            CI/CD Failures (GitHub Actions)
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIntegration === "prometheus"}
              onChange={() => handleCheckbox("prometheus")}
              className="w-5 h-5"
            />
            Observability Alerts (Prometheus)
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIntegration === "slack"}
              onChange={() => handleCheckbox("slack")}
              className="w-5 h-5"
            />
            ChatOps (Slack / MS Teams)
          </label>

        </div>

        <button
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg w-full transition"
          onClick={handleContinue}
        >
          Continue
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center px-4">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">
                Configure {selectedIntegration?.toUpperCase()}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {selectedIntegration === "github" && (
                  <>
                    {!repos.length ? (
                      <>
                        <input
                          type="password"
                          placeholder="GitHub Personal Access Token"
                          className="w-full border px-3 py-2 rounded"
                          value={pat}
                          onChange={(e) => setPat(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={fetchRepos}
                          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                        >
                          {loadingRepos ? "Fetching Repos..." : "Fetch Repositories"}
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">Select Repository:</p>
                       <select
                        className="w-full border px-3 py-2 rounded"
                        onChange={(e) => setSelectedRepo(e.target.value)}
                      >
                        <option value="">Choose Repo</option>
                        {repos.map((repo) => (
                          <option
                            key={repo.name}
                            value={JSON.stringify(repo)} // now safe
                          >
                            {repo.owner}/{repo.name}
                          </option>
                        ))}
                      </select>

                      </>
                    )}
                  </>
                )}

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={selectedIntegration === "github" && !selectedRepo}
                    className={`px-4 py-2 rounded-md text-white ${
                      selectedIntegration === "github" && !selectedRepo
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Connect
                  </button>

                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
