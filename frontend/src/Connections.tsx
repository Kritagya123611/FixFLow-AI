import React, { useState } from "react";

export default function Connections() {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

type Integration = "github" | "prometheus" | "slack";

const handleCheckbox = (integration: Integration): void => {
    setSelectedIntegration(integration);
};

  const handleContinue = () => {
    if (!selectedIntegration) {
      alert("Please select one integration first before continuing.");
      return;
    }
    setShowModal(true);
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    alert(`Successfully connected: ${selectedIntegration}`);
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
                    <input
                        name="pat"
                        type="text"
                        placeholder="Personal Access Token"
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                  </>
                )}
                {selectedIntegration === "prometheus" && (
                  <>
                    <input
                      type="text"
                      placeholder="Prometheus Endpoint URL"
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Read-Only Auth Token"
                      className="w-full border px-3 py-2 rounded"
                    />
                  </>
                )}

                {selectedIntegration === "slack" && (
                  <>
                    <button
                      type="button"
                      className="bg-green-600 text-white px-4 py-2 rounded w-full"
                    >
                      Add to Slack
                    </button>
                    <input
                      type="text"
                      placeholder="Default Alert Channel Name"
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
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
