require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { analyzeRepo } = require('./githubAnalyzer');
const { generateRoast } = require('./roastEngine');

const app = express();
app.use(cors());
app.use(express.json());

// Main roast endpoint
app.post('/api/roast', async (req, res) => {
    const { repoUrl } = req.body;

    if (!repoUrl) {
        return res.status(400).json({ error: 'Repo URL do bhai' });
    }

    try {
        // URL se owner aur repo name nikalo
        // Format: https://github.com/owner/repo
        const parts = repoUrl.replace('https://github.com/', '').split('/');
        const owner = parts[0];
        const repoName = parts[1];

        if (!owner || !repoName) {
            return res.status(400).json({ error: 'Sahi GitHub URL daal bhai' });
        }

        console.log(`🔥 Roasting ${owner}/${repoName}`);

        // Step 1: Analyze
        const repoData = await analyzeRepo(owner, repoName);

        // Step 2: Generate roast
        const roast = await generateRoast(repoData);

        res.json({
            success: true,
            repo: `${owner}/${repoName}`,
            stats: {
                stars: repoData.stars,
                commits: repoData.totalCommits,
                badCommits: repoData.badCommitCount,
                todos: repoData.todoCount,
                openIssues: repoData.openIssues,
            },
            roast
        });

    } catch (error) {
        console.error(error.message);
        if (error.response?.status === 404) {
            return res.status(404).json({ error: 'Repo mila nahi — shayad itna sharmainda hai ki private kar diya' });
        }
        res.status(500).json({ error: 'Kuch toh gadbad hai bhai: ' + error.message });
    }
});

// Health check
app.get('/', (req, res) => {
    res.json({ status: '🔥 repo-roast is alive and ready to hurt feelings' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🔥 Server chal raha hai port ${PORT} pe`);
});