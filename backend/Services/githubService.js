import { Octokit } from "@octokit/rest";

export const createOctokitClient=async(personalAccessToken)=>{
    return new Octokit({auth:personalAccessToken});
}

export async function getUserInfo(personalAccessToken){
    const octokit=await createOctokitClient(personalAccessToken);
    const {data}=await octokit.rest.users.getAuthenticated();
    return data;
}

export async function getRepoList(PAT) {
  const octokit = await createOctokitClient(PAT);
  const response = await octokit.rest.repos.listForAuthenticatedUser({
    per_page: 100
  });
  return response.data.map(repo => ({
    name: repo.name,
    owner: repo.owner.login,  
  }));
}


export async function getRepoContents(personalAccessToken, owner, repo, filepath) {
  const octokit = await createOctokitClient(personalAccessToken);

  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: filepath,
  });

  const decoded = Buffer.from(data.content, data.encoding).toString("utf-8");

  return {
    name: data.name,
    path: data.path,
    html_url: data.html_url,
    content: decoded,
  };
}


export async function createIssue(personalAccessToken, owner, repo, title, body){
    const octokit=await createOctokitClient(personalAccessToken);
    const resonse=await octokit.issues.create({
        owner,
        repo,
        title,
        body
    });
    return response.data;
}
