db.createUser(
  {
    user: "daboss",
    pwd: "s3crEt!",
    roles: [
      {
        role: "readWrite",
        db: "mesinesp2"
      }
    ]
  }
)