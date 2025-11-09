import axios from "axios";

export default async function CreateJiraTicket(issueDetails) {
  try {
    const { title, description, severity } = issueDetails;

    const payload = {
      fields: {
        project: {
          key: process.env.JIRA_PROJECT_KEY,
        },
        summary: title,
        description: {
        type: "doc",
        version: 1,
        content: [
            {
            type: "paragraph",
            content: [
                {
                type: "text",
                text: description
                }
            ]
            }
        ]
        },
        issuetype: {
          name: "Task", 
        },
        priority: {
          name: severity === "high" ? "Highest" : "Medium",
        },
      },
    };

    const response = await axios.post(
      `${process.env.JIRA_BASE_URL}/rest/api/3/issue`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: process.env.JIRA_EMAIL,
          password: process.env.JIRA_API_TOKEN,
        },
      }
    );

    return {
      key: response.data.key,
      url: `${process.env.JIRA_BASE_URL}/browse/${response.data.key}`,
    };
  } catch (error) {
    console.error("Jira Ticket Creation Failed:", error.response?.data || error.message);
    throw error;
  }
}
