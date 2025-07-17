const express = require('express')
const app = express()
const PORT = 3001
const path = require('path')
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const axios = require("axios");
const User=require('./models/user.js')
const Store=require('./models/store.js')
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Sandbox endpoint
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',  // or wherever your React app runs
  credentials: true                // 🔥 must be true to support cookies
}));
app.use('/uploads', express.static('uploads'));

const multer=require('multer')
mongoose.connect('mongodb://127.0.0.1:27017/e')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/e' }),
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));
app.use(passport.initialize());
app.use(passport.session());

// Get PayPal access token
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 
      'grant_type=client_credentials', 
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

    return response.data.access_token;
  } catch (err) {
    console.error("Failed to get PayPal access token:", err.response?.data || err.message);
    throw new Error("Unable to get PayPal access token");
  }
}

// Create PayPal Order
app.post('/create-paypal-order', async (req, res) => {
  const { amount } = req.body;

  if (!amount) return res.status(400).json({ error: 'Amount is required' });

  try {
    const accessToken = await getPayPalAccessToken();

    const order = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2),
          },
        },
      ],
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    res.status(200).json({ id: order.data.id });
  } catch (err) {
    console.error("PayPal Order Creation Failed:", err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});
passport.use(new LocalStrategy(
  { usernameField: 'mail' },  // tell passport to use `mail` instead of `username`
  async (mail, password, done) => {
    const user = await User.findOne({ mail });
    if (!user) return done(null, false, { message: 'User not found' });

    const match = await bcrypt.compare(password, user.pass);
    if (!match) return done(null, false, { message: 'Wrong password' });

    return done(null, user._id);
  }
));

passport.serializeUser((user, done) => {
  done(null, user); // Store only the user ID in session
});

passport.deserializeUser(async (id, done) => {
 
  done(null, id);
});

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ msg: 'You must be logged in' });
}





























    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          return cb(null, './uploads');  // The folder where files will be stored
        },
        filename: (req, file, cb) => {
          const filename = Date.now() + path.extname(file.originalname);  // Generate unique filename
          return cb(null, filename);  // Provide the generated filename
        }
      });

      const upload=multer({storage})













app.post('/signup', async (req, res) => {
    let { username,password,mail } = req.body
    let hashed=await bcrypt.hash(password, 10);
    let user = new User({
        name: username,
        pass:hashed,
        mail:mail,
        cart: [],
        product: []
    })
    await user.save()
    if (user) {
        res.json({ msg: 'added' })
    } else {
        res.json({ msg: 'not added' })
    }
})
app.post('/signin', passport.authenticate('local'), (req, res) => {
  res.json({ msg: 'Logged in successfully', user: req.user });
});
app.post('/search',ensureAuth, async (req, res) => {
  let { product } = req.body;

  let regexArray = product.map(word => ({ name: { $regex: word, $options: 'i' } }));

  let results = await Store.find({ $or: regexArray });

  if (results.length === 0) { 
    return res.status(404).json({ msg: "Not Found" });
  }

  let new_arr = await Promise.all(
    results.map(async (value) => {
      let user = await User.findOne({ _id: value.userid });
      return {
        product: value,
        
      };
    }) 
  );

  
  res.json({ msg: 'found', new_arr });
});

app.post('/add_p',ensureAuth, upload.single('img'), async (req, res) => {
    
      const {  p_name, p_price,p_des,qnt } = req.body;
let username=req.user
      const imagePath = `/uploads/${req.file.filename}`;
      const userid= req.user
     
      console.log("id is",req.user)
      const user=await User.findOne({_id:userid})
       console.log("user is",user._id)
      const store= await new Store({
        name:p_name,
        userid:user._id,
        price:p_price,
        image:imagePath,
        quantity:qnt,
        description:p_des,
      })      
      console.log(user)
      await store.save();
      console.log("user product and is is ",user._id)
      await user.product.push(store._id)
      await user.save();
       
      res.json({msg:'added'});
  });

app.get('/all_products', async (req, res) => {
    try {
        const products = await Store.find();
        res.json({ products });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to fetch products', error: err });
    }
});
  app.post('/cart_a',ensureAuth ,async (req,res)=>{
    let {product}=req.body
    console.log(product)
    let customerid=req.user
    console.log(customerid)
    let user =await User.findOne({_id:customerid})
    user.cart.push(product.id)
    await user.save()
    res.json({msg:'added to cart'});
  })

 app.post('/ret_cart',ensureAuth, async (req, res) => {
    let  username  = req.user;

    let user = await User.findOne({ _id: username });
    if (!user || !user.cart || user.cart.length === 0) {
        return res.status(404).json({ msg: 'Cart is empty or user not found' });
    }

    // user.cart is assumed to be an array of product IDs
    let cartProductIds = user.cart;

    // Find all products whose _id is in the cart
    let products = await Store.find({ _id: { $in: cartProductIds } });

    res.json({ msg: 'Showing cart items', products });
});


  app.post('/qnt_add',ensureAuth,async (req,res)=>{
    let {username,product}=req.body
    let user =await User.findOne({name:username})
    let cart=user.cart
    let item=await cart.find(p=>p.name==product.name && p.price==product.price && p.image==product.image)
    item.qnt=Number(item.qnt)+1
    await user.save()
    let qnt=item.qnt
    res.json({msg:'item updated',qnt});
  })
  app.post('/qnt_less',ensureAuth,async (req,res)=>{
    let {username,product}=req.body
    let user =await User.findOne({name:username})
    let cart=user.cart
    let item=await cart.find(p=>p.name==product.name && p.price==product.price && p.image==product.image)
    if (item.qnt > 1) {
        item.qnt -= 1; // Just decrease quantity
        await user.save()
    let qnt=item.qnt
    res.json({msg:'item updated',qnt});
    } else {
        // Remove product when qnt reaches 0
        user.cart = user.cart.filter(p => p.name !== product.name && p.price!==product.price && p.image!==product.image);
        await user.save()
        res.json({msg:'item removed'});
    }
   
    
  })


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});