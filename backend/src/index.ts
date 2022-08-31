import app from './app'

const { PORT = 5000 } = process.env

app.listen(PORT, () => `Express is running on http://localhost:${PORT}`)
