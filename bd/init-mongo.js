db.createUser({
  user: 'admin',
  pwd: 'dev252318',
  roles: [
    {
      role: 'userAdminAnyDatabase',
      db: 'admin',
    },
  ],
})

db = db.getSiblingDB('dadospc')

db.createCollection('usuarios')
