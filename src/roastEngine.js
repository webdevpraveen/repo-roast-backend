const axios = require('axios');

async function generateRoast(repoData) {
    const prompt = buildPrompt(repoData);

    const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
            model: 'llama-3.3-70b-versatile',
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }]
        },
        {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data.choices[0].message.content;
}

function buildPrompt(data) {
    const daysSinceUpdate = Math.floor(
        (new Date() - new Date(data.updatedAt)) / (1000 * 60 * 60 * 24)
    );

    const daysSinceCreation = Math.floor(
        (new Date() - new Date(data.createdAt)) / (1000 * 60 * 60 * 24)
    );

    return `
You are a savage but hilarious comedy roast master for GitHub repositories.
Your job: roast this repo BRUTALLY but in a funny, developer-humor way.
Be specific — use the actual data given. Don't be generic.
Use relatable programmer pain points. Mix English and Hindi casually.
Keep it to 300-400 words. End with an overall rating like "💀/10" or "2 TODO comments out of 10".

Here is the repo data to roast:

Repo: ${data.owner}/${data.name}
Description: ${data.description}
Stars: ${data.stars} | Forks: ${data.forks} | Open Issues: ${data.openIssues}
Languages: ${Object.keys(data.languages).join(', ') || 'None detected (impressive)'}
Created: ${daysSinceCreation} days ago | Last updated: ${daysSinceUpdate} days ago
Total commits analyzed: ${data.totalCommits}
Bad/lazy commit messages (${data.badCommitCount}): ${data.badCommitExamples.join(' | ') || 'None (suspicious)'}
Recent commits: ${data.allCommitMessages.slice(0, 8).join(' | ')}
README exists: ${data.hasReadme} | README length: ${data.readmeLength} characters
README preview: "${data.readmeContent.slice(0, 200)}"
TODO comments in code: ${data.todoCount}
Open issues sample: ${data.openIssuesList.join(' | ') || 'None'}
License: ${data.license}
Repo size: ${data.size} KB

Now ROAST this repo. Be funny, specific, brutal, and developer-relatable.
`;
}

module.exports = { generateRoast };