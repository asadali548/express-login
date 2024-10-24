const express = require("express");
const bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
const app = express();
const port = 8080;
const secretKey = "mykey.11334422";
app.use(bodyParser.json());
// New added data start
const AllUsrDATA = {
  kashif: {
    email: "ali@gmail.com",
    password: "ali.112233",
    posts: [
      // post 1 start here
      {
        post: 1,
        content: "That Is First Post From ALi ",
        category: "text",
        likes: {
          likedNumber: 2,
          likedBy: ["bilal", "meesum"],
        },
        comments: [
          {
            commentNumber: 1,
            userId: "bilal",
            comment: "AWSOM TEXT ",
          },
        ],
      },
      // post 2 start here
      {
        post: 2,
        content: "That  Is second post from Ali",
        category: "text",
        likes: {
          likedNumber: 2,
          likedBy: ["bilal", "meesum"],
        },
        comments: [
          {
            commentNumber: 1,
            userId: "meesum",
            comment: "nice!",
          },
        ],
      },
      // post 2 end here
    ],
  },

  // 2nd data is start
  ali: {
    email: "bilal@gmail.com",
    password: "b.11223",
    posts: [
      // post 1 start here
      {
        post: 1,
        content: "That Is First Post From Bilal",
        category: "text",
        likes: {
          likedNumber: 2,
          likedBy: ["ali", "meesum"],
        },
        comments: [
          {
            commentNumber: 1,
            userId: "ali",
            comment: "Well bro",
          },
        ],
      },
      // post 2 start here
      {
        post: 2,
        content: "That Is second post from bilal",
        category: "text",
        likes: {
          likedNumber: 2,
          likedBy: ["ali", "meesum"],
        },
        comments: [
          {
            commentNumber: 1,
            userId: "meesum",
            comment: "Fab",
          },
        ],
      },
      // post 2 end here
    ],
  },
  //   third key start
  haroon: {
    email: "meesum@gmail.com",
    password: "m.11233",
    posts: [
      // post 1 start here
      {
        post: 1,
        content: "That Is First Post From meesum",
        category: "text",
        likes: {
          likedNumber: 2,
          likedBy: ["ali", "bilal"],
        },
        comments: [
          {
            commentNumber: 1,
            userId: "ali",
            comment: "Nice bro",
          },
        ],
      },
      // post 2 start here
      {
        post: 2,
        content: "This Is second post",
        category: "text",
        likes: {
          likedNumber: 2,
          likedBy: ["ali", "bilal"],
        },
        comments: [
          {
            commentNumber: 1,
            userId: "ali",
            comment: "I love this bro",
          },
        ],
      },
      // post 2 end here
    ],
  },
};
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  for (let data in AllUsrDATA) {
    if (AllUsrDATA[data].email == email && AllUsrDATA[data].password == password) {
      let uEmail = AllUsrDATA[data].email;
      var token = jwt.sign({ email: uEmail }, secretKey);
      return res.status(200).json({
        message: "Login successful",
        token
      });
    }
  }
  return res.status(401).json({
    message: "Invalid username or password",
  });
});
app.get("/isLoggedIn", authenticate, (req, res) => {
  let user = req.user;
//   let newuser=userData[loggesUser].posts
  return res.status(200).json({
    message: "is logged in",
    user,
    // newuser,
  });
});
// for profile post start
app.get('/profile', authenticate, (req, res) => {
    const loggedInEmail = req.user.email;
    let userPosts = null;
    for (let userKey in AllUsrDATA) {
      if (AllUsrDATA[userKey].email === loggedInEmail) {
        userPosts = AllUsrDATA[userKey].posts;
        break;
      }
    }
    if (userPosts) {
      return res.status(200).json({
        message: "Profile posts",
        posts: userPosts
      });
    } else {
      return res.status(404).json({
        message: "No posts of login user"
      });
    }
  });
// for profile post end
// now i starting code for timeline post mean without user
app.get('/timeline' ,authenticate, (req , res)=>{
let loginEmail = req.user.email;
let timelinePost = [];
for (let userKey in AllUsrDATA){
    if(AllUsrDATA[userKey].email != loginEmail){
        timelinePost =timelinePost.concat(AllUsrDATA[userKey].posts)
    }
}
return res.status(200).json({
    message : "timeline posts",
    posts : timelinePost
});
}) ;
// timelined end
// THis is middleware function 
function authenticate(req, res, next) {
  console.log("Middleware");
  if (req.headers.token) {
    try {
      var decoded = jwt.verify(req.headers.token, secretKey);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
  } else {
    return res.status(401).json({
      message: "Not Logged in",
    });
  }
}
// THis is middleware function 
app.listen(port, () => {
  console.log(`Example  app listening on port ${port}`);
})