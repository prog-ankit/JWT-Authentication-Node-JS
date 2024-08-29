const express = require("express");
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const defaultuser = [
  {
    id: 1,
    username: "admin",
    password: "admin",
    isAdmin: true,
  },
  {
    id: 2,
    username: "ankit",
    password: "ankit",
    isAdmin: false,
  },
];
const refreshTokens = [];
app.post("/api/refreshToken",(req,res) => {
  const token = req.body.token;
  if(!token) res.status(401).json("User is not authorized!");
  if(!refreshTokens.includes(token)) res.status(403).json("token is invalid!");
  jwt.verify(token,"refreshTesting",(err,user) => {
    err && console.log(err);
    ///removes the current refresh token from refreshTokens array
    refreshTokens = refreshTokens.filter((refreshToken) => refreshToken !== token);
    const newAccessToken = jwt.sign({ id : user.id, isAdmin : user.isAdmin}, "testing",{expiresIn : "10s"});
    const newRefreshToken = jwt.sign({id: user.id, isAdmin: user.isAdmin}, "refreshTesting");
    refreshTokens.push(newRefreshToken);

    return res.status(200).json({
      newAccessToken : newAccessToken,
      newRefreshToken : newRefreshToken
    });
  })
});
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = defaultuser.find(obj => {
    return obj.username === username && obj.password === password
  });
  if(user) {
    const accessToken = jwt.sign({ id : user.id, isAdmin : user.isAdmin}, "testing",{expiresIn : "10s"});
    const refreshToken = jwt.sign({id: user.id, isAdmin: user.isAdmin}, "refreshTesting");
    refreshTokens.push(refreshToken);

    res.json({
      username : user.username,
      isAdmin : user.isAdmin,
      accessToken,
      refreshToken
    })
  } else {
    res.status(400).json("User Not Found.");
  }
  res.json("Hello, Testing going on!!");
});

const verify = (req,res,next) => {
  const authHeader = req.headers.authorization;
  if(authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token,"testing",(err,user) => {
      if(err){
        return res.status(403).json("Token is not valid");
      } else {
        req.user = user;
        next();
      }
    });
    console.log(token);
  } else {
    return res.status(401).json("User is unauthorized!!");
  }
}
app.delete("/api/users/:userId",verify,(req,res) => {
  if(req.user.id === req.params.userId || req.user.isAdmin) {
    res.status(200).json("User is deleted!!");
  } else {
    res.status(404).json("User does not exist or you are not admin.");
  }
})
app.listen(5000, () => {
  console.log("Server is Running on port 5000.");
});
