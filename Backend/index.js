const express = require('express');
const app = express();
const cors=require('cors');
const bodyParser=require("body-parser");
const mongoose = require('mongoose');
const mongourl="mongodb+srv://iotclicker:clicker@clicker.wuf5rhy.mongodb.net/?retryWrites=true&w=majority&appName=Clicker"
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const jwtsecret="mynameispiyushnicetomeetyou";
const User = require('./models/User');
const { body,validationResult} = require('express-validator');
const Click=require('./models/Click')


mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5000");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
app.use(cors());
// Middleware setup
// app.use(express.json()); // Parse JSON request bodies
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.static('public')); // Serve static files (e.g., images) from the 'public' directory

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/createuser',[body('email','incorrect email').isEmail(), body('password','incorrect password').isLength({ min: 5 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    // If there are validation errors, it returns a 400 Bad Request response with error details.
    const salt = await bcrypt.genSalt(10);
    const secpassword = await bcrypt.hash(req.body.password, salt);
    
    try {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpassword,
      });
      
      // Create payload for JWT token
      const data = {
        user: {
          id: user.id
        }
      };

      // Generate JWT token
      const authToken = jwt.sign(data, jwtsecret);

      // Send response with JWT token
      res.json({ success: true, authToken: authToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to create user' });
    }
  }
);

app.post('/loginuser',[body('email').isEmail(), body('password','password is too small').isLength({ min: 5 })],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
            
      let email=req.body.email;

      try {
      //It attempts to find a user with the provided email in the database using User.findOne.
      let useremail=await User.findOne({email});
      if(!useremail)return res.status(400).json({ errors:"username not found" });     
                
      //If the email is found, it uses bcrypt.compare to compare the provided password with the hashed password stored in the database.
      const pwdcompare=await bcrypt.compare(req.body.password,useremail.password);
      if(!pwdcompare) return res.status(400).json({ errors: "password incorrect" });
                
      //If the passwords match, it generates a JWT token (authToken) containing user information and signs it using a secret key (jwtsecret).
      const data={
        user:{
          id:useremail.id
        }
      }
      const authToken=jwt.sign(data,jwtsecret)
      console.log(authToken);
      return res.json({success:true,authToken:authToken})
      } catch (error) {
      console.log(error)
        res.json({ success: false })}

        //After validating the user's email and password and confirming that they match a user in the database, the code creates a JWT token.
//The payload of the JWT (the data it carries) is set to the data object. In this case, the data object includes the user's ID.
//The JWT token is then signed with a secret key (jwtsecret) to ensure its authenticity and integrity.
//Finally, the JWT token is included in the response to the client. The client can use this token to make authenticated requests to protected routes or APIs in your application, and it can also decode the token to access the user's ID or other user-specific information as needed.

    })
const checkUser = (req, res, next) => {
      const userId = req.headers['user-id'];
    
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized - Missing user ID' });
      }
    
      // Assuming you have a User model defined with Mongoose
      User.findOne({ _id: userId })
        .then((user) => {
          if (!user) {
            return res.status(403).json({ error: 'Unauthorized' });
          }
          // User is found, proceed to upload
          next();
        })
        .catch((err) => {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        });
};

const authenticateUser = (req, res, next) => {
    // Extract the JWT from the request headers
    const token = req.header('Authorization');
    if (!token)  return res.status(401).json({ error: 'Unauthorized - Missing token' });

    try {
      // Verify the JWT and extract user information
      const decoded = jwt.verify(token, 'mynameispiyushnicetomeetyou');
      req.user = decoded.user.id;
      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
  };


  app.post('/upload', checkUser, async (req, res) => {
    try {
      const dataArray = req.body; // Assuming req.body is an array of JSON objects
  
      for (const data of dataArray) {
        const { id, timestamp } = data;
        const userId = req.headers['user-id']; // Assuming this header contains the user ID
        const timestampDate = new Date(timestamp);
  
        const click = new Click({
          UserData: userId,
          device_id: id,
          timestamp: timestampDate
        });
  
        await click.save();
      }
  
      return res.status(200).json({ message: 'Data saved successfully.' });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: 'Error saving to the database.' });
    }
  });
  

  

app.get('/data', authenticateUser, async (req, res) => {
    try {
      const data = await Click.find({ 'UserData': req.user }); 
      console.log(data);
      console.log(req.user);
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Error fetching data.' });
    }
  });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});




