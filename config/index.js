module.exports = {
  db: {                             
    uri: 'mongodb://localhost:27017/blocky',   // MongoDB database address
    options: {
      useNewUrlParser: true
    }
  },
  jwt: {
    secret: 'jwt_secret' // Todo: Update secret to encrypt JSON Web Token
  },
  dataFilePath: '/path/blynk/data/',
  privateKeyPath: '/privkey.pem',
  certificatePath: '/fullchain.crt',
  facebook: {
    clientId: 'client_id',
    clientSecret: 'client_secret',
  }
};