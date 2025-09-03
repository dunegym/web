const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// 将当前目录作为静态文件根目录，直接对外暴露 index.html、scripts.js、styles.css、music/ 等
app.use(express.static(path.join(__dirname)));

// 明确处理根路径，返回 index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 绑定 0.0.0.0 以便对公网可见
app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
});