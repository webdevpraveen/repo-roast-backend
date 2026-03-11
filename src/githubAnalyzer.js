const axios = require('axios');

const github = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
    }
});

async function analyzeRepo(owner, repoName) {
    console.log(`🔍 Analyzing ${owner}/${repoName}...`);

    const [repo, commits, languages, issues, contents] = await Promise.all([
        github.get(`/repos/${owner}/${repoName}`),
        github.get(`/repos/${owner}/${repoName}/commits?per_page=50`),
        github.get(`/repos/${owner}/${repoName}/languages`),
        github.get(`/repos/${owner}/${repoName}/issues?state=open&per_page=20`),
        github.get(`/repos/${owner}/${repoName}/contents`).catch(() => ({ data: [] }))
    ]);

    // Commit messages analyze karo
    const commitMessages = commits.data.map(c => c.commit.message);
    const badCommits = commitMessages.filter(msg =>
        /^(fix|update|wip|asdf|test|lol|ok|done|changes|misc|stuff|asd)$/i.test(msg.trim())
    );

    // README check karo
    const readme = contents.data.find(f =>
        f.name.toLowerCase().startsWith('readme')
    );

    let readmeContent = '';
    if (readme) {
        const readmeData = await github.get(readme.url);
        readmeContent = Buffer.from(readmeData.data.content, 'base64').toString('utf8');
    }

    // TODO comments dhundo (agar JS/TS repo hai)
    let todoCount = 0;
    try {
        const searchResult = await github.get(
            `/search/code?q=TODO+repo:${owner}/${repoName}`
        );
        todoCount = searchResult.data.total_count;
    } catch (e) { }

    return {
        name: repo.data.name,
        owner: repo.data.owner.login,
        description: repo.data.description || 'No description (classic)',
        stars: repo.data.stargazers_count,
        forks: repo.data.forks_count,
        openIssues: repo.data.open_issues_count,
        createdAt: repo.data.created_at,
        updatedAt: repo.data.updated_at,
        size: repo.data.size,
        defaultBranch: repo.data.default_branch,
        languages: languages.data,
        totalCommits: commits.data.length,
        badCommitCount: badCommits.length,
        badCommitExamples: badCommits.slice(0, 5),
        allCommitMessages: commitMessages.slice(0, 20),
        hasReadme: !!readme,
        readmeLength: readmeContent.length,
        readmeContent: readmeContent.slice(0, 500),
        openIssuesList: issues.data.slice(0, 5).map(i => i.title),
        todoCount,
        license: repo.data.license?.name || 'No license (piracy-friendly)',
        isPrivate: repo.data.private,
        hasWiki: repo.data.has_wiki,
        hasPages: repo.data.has_pages,
    };
}

module.exports = { analyzeRepo };