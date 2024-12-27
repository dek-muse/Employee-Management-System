const express = require('express');
const employeeRouter = require('./router/employeeRouter')

const app = express();
const PORT = 300;

app.use('/employ', employeeRouter);
// Define a simple GET endpoint
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})