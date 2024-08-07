const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
    const { url } = req.body;

    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const totalRequests = $('script, link[rel="stylesheet"], img').length;

        const performanceData = {
            url,
            pageLoadTime: response.headers['request-duration'],
            totalRequestSize: response.headers['content-length'],
            totalRequests
        };

        res.json(performanceData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to analyze the website' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
