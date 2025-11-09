import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaSlack } from "react-icons/fa";
import { MdOutlineMonitorHeart } from "react-icons/md";

export default function Connections() {
  const navigate = useNavigate();
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [pat, setPat] = useState("");
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [loadingRepos, setLoadingRepos] = useState(false);

  const handleCheckbox = (integration) => {
    setSelectedIntegration(integration);
    setRepos([]);
    setSelectedRepo(null);
  };

  const handleContinue = () => {
    if (!selectedIntegration) return alert("Select one integration to continue.");
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
    } catch {
      alert("Failed to fetch repositories. Check your token.");
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedIntegration === "github" && !selectedRepo)
      return alert("Please select a repository");

    const repoObj = JSON.parse(selectedRepo);
    const res = await fetch("http://localhost:5000/api/supabase/saveConnection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pat,
        repo_owner: repoObj.owner,
        repo_name: repoObj.name,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Connected Successfully!");
      localStorage.setItem("selectedRepo", JSON.stringify(repoObj));
      navigate("/webhooksetup");
    } else alert("Failed: " + data.error);

    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-10 w-full max-w-xl">
        <h1 className="text-3xl font-semibold text-gray-900 text-center">
          Integrations
        </h1>
        <p className="text-gray-600 text-center mt-1 mb-8">
          Select where FixFlow should listen for alerts
        </p>

        {/* ✅ Integration Options */}
        <div className="grid gap-4">
          {[
            {
              key: "github",
              label: "CI/CD Failures (GitHub Actions)",
              icon: <FaGithub className="text-xl" />,
            },
            {
              key: "prometheus",
              label: "Observability Alerts (Prometheus)",
              icon: <MdOutlineMonitorHeart className="text-xl" />,
            },
            {
              key: "slack",
              label: "ChatOps (Slack / Teams)",
              icon: <FaSlack className="text-xl" />,
            },
          ].map(({ key, label, icon }) => (
            <label
              key={key}
              className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition
                ${
                  selectedIntegration === key
                    ? "border-blue-600 bg-blue-50"
                    : "hover:bg-gray-100"
                }`}
            >
              <input
                type="checkbox"
                checked={selectedIntegration === key}
                onChange={() => handleCheckbox(key)}
                className="w-5 h-5"
              />
              {icon}
              <span className="font-medium text-gray-800">{label}</span>
            </label>
          ))}
        </div>

        {/* ✅ Continue Button */}
        <button
          className={`mt-8 w-full px-6 py-3 rounded-lg text-white transition
            ${
              selectedIntegration
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          onClick={handleContinue}
          disabled={!selectedIntegration}
        >
          Continue
        </button>

        {/* ✅ Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
              <h3 className="text-xl font-bold mb-6">
                Configure {selectedIntegration?.toUpperCase()}
              </h3>

              {/* GitHub Config */}
              {selectedIntegration === "github" && (
                <form className="space-y-4" onSubmit={handleSubmit}>
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                        onClick={fetchRepos}
                      >
                        {loadingRepos ? "Fetching..." : "Fetch Repositories"}
                      </button>
                    </>
                  ) : (
                    <>
                      <label className="font-medium text-gray-700">
                        Choose a repository:
                      </label>
                      <select
                        className="w-full border px-3 py-2 rounded"
                        onChange={(e) => setSelectedRepo(e.target.value)}
                      >
                        <option value="">Select Repo</option>
                        {repos.map((repo) => (
                          <option
                            key={repo.name}
                            value={JSON.stringify(repo)}
                          >
                            {repo.owner}/{repo.name}
                          </option>
                        ))}
                      </select>
                    </>
                  )}

                  {/* Modal Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={!selectedRepo}
                      className={`px-4 py-2 text-white rounded ${
                        selectedRepo
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Connect
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
