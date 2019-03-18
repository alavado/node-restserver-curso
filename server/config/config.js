// ==========================================
// Puerto
// ==========================================
process.env.PORT = process.env.PORT || 3000

// ==========================================
// Entorno
// ==========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
let urlDB
if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe'
}
else {
  const pass = 'SkvmhOZOIg3AU3ah', usr = 'alejandro'
  urlDB = `mongodb+srv://${usr}:${pass}@cluster0-lsljf.mongodb.net/cafe?retryWrites=true`
}
process.env.URLDB = urlDB