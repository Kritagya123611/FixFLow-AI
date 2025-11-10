import axios from "axios";

export default async function NotifyPagerDuty(alertDetails) {
  try {
    const { title, info } = alertDetails;

    const response = await axios.post(
      "https://events.pagerduty.com/v2/enqueue",
      {
        routing_key: process.env.PAGERDUTY_ROUTING_KEY, // Required
        event_action: "trigger",
        payload: {
          summary: title,
          severity: "warning", // low→warning ; medium→error ; high→critical (optional)
          source: "FixFlow AI - CI Monitor",
          custom_details: info,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("PagerDuty Alert Triggered →", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "PagerDuty Notification Failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}
