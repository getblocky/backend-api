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
  dataFilePath: '/home/vanminh0910_gmail_com/blynk/data/'
};