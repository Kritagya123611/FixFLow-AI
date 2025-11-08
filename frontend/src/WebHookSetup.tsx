import React, { useEffect, useState } from "react";

export default function WebHookSetup() {
  const [repo, setRepo] = useState<{ owner: string; name: string } | null>(null);
  const [status, setStatus] = useState<{ connected: boolean; lastEvent?: any } | null>(null);

  useEffect(() => {
    const storedRepo = localStorage.getItem("selectedRepo");
    if (storedRepo) {
      setRepo(JSON.parse(storedRepo));
    }
  }, []);

const verifyWebhook = async () => {
  try {
    const res = await fetch(
      "https://jaxon-unwritten-infortunately.ngrok-free.dev/api/github/webhook/status",
      {
        headers: { "Accept": "application/json" },
        cache: "no-store",
      }
    );

    const text = await res.text();

    if (!text.startsWith("{")) {
      console.error("❌ HTML instead of JSON:", text);
      alert("Backend not reachable via ngrok. Please restart ngrok with correct flags.");
      return;
    }

    const data = JSON.parse(text);
    setStatus(data);
  } catch (err) {
    console.error("Request Failed:", err);
  }
};

  const webhookURL = `https://jaxon-unwritten-infortunately.ngrok-free.dev/api/github/webhook`;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl space-y-6">
        <h1 className="text-3xl font-bold">Webhook Setup</h1>

        {repo ? (
          <>
            <p className="text-gray-700">
              You're connecting <span className="font-semibold">{repo.owner}/{repo.name}</span> to FixFlow 🚀
            </p>

            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="font-semibold text-gray-800">Webhook URL:</p>
              <p className="text-blue-600 break-all font-mono">{webhookURL}</p>
            </div>

            <div className="space-y-3 text-left text-gray-700">
              <h2 className="font-semibold">Setup Instructions:</h2>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Go to your Repo on GitHub → Settings → Webhooks</li>
                <li>Click <strong>Add Webhook</strong></li>
                <li>Paste the Webhook URL</li>
                <li>Set <strong>Content-Type → application/json</strong></li>
                <li>Select events → <strong>Push + Pull Request + Workflow Runs</strong></li>
                <li>Click <strong>Add Webhook ✅</strong></li>
              </ol>
            </div>

            <button
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
              onClick={verifyWebhook}
            >
              ✅ Verify Webhook
            </button>

            {status && (
              <div className="mt-4 border p-3 rounded bg-gray-50 text-left">
                {status.connected ? (
                  <>
                    <p className="text-green-600 font-bold">Webhook Connected ✅</p>
                    <p className="text-sm text-gray-700">
                      Last Event: {status.lastEvent.type}<br />
                      Repo: {status.lastEvent.repo}<br />
                      At: {new Date(status.lastEvent.time).toLocaleString()}
                    </p>
                  </>
                ) : (
                  <p className="text-red-500 font-semibold">
                    ❌ No webhook event received yet. Trigger a push or PR!
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-red-600 font-semibold">No repository selected. Please return and connect GitHub first.</p>
        )}
      </div>
    </div>
  );
}
