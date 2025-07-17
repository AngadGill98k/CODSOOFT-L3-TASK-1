let express = require('express')
let app = express()
let PORT = 3001
let path = require('path')
let mongoose = require('mongoose');
let cors = require('cors');
require('dotenv').config();
let axios = require("axios");
let User=require('./models/user.js')
let Store=require('./models/store.js')
let bcrypt = require('bcrypt');
let session = require('express-session');
let MongoStore = require('connect-mongo');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Sandbox endpoint
let { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true                
}));
app.use('/uploads', express.static('uploads'));

let multer=require('multer')
mongoose.connect('mongodb://127.0.0.1:27017/e')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/e' }),
  cookie: { maxAge: 1000 * 60 * 60 } 
}));
app.use(passport.initialize());
app.use(passport.session());


async function getPayPalAccessToken() {
  let auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  try {
    let response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 
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


app.post('/create-paypal-order', async (req, res) => {
  let { amount } = req.body;

  if (!amount) return res.status(400).json({ error: 'Amount is required' });

  try {
    let accessToken = await getPayPalAccessToken();

    let order = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, {
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
  { usernameField: 'mail' },  
  async (mail, password, done) => {
    let user = await User.findOne({ mail });
    if (!user) return done(null, false, { message: 'User not found' });

    let match = await bcrypt.compare(password, user.pass);
    if (!match) return done(null, false, { message: 'Wrong password' });

    return done(null, user._id);
  }
));

passport.serializeUser((user, done) => {
  done(null, user); 
});

passport.deserializeUser(async (id, done) => {
 
  done(null, id);
});

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ msg: 'You must be logged in' });
}





























    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
          return cb(null, './uploads'); 
        },
        filename: (req, file, cb) => {
          let filename = Date.now() + path.extname(file.originalname); 
          return cb(null, filename); 
        }
      });

      let upload=multer({storage})













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
    
      let {  p_name, p_price,p_des,qnt } = req.body;
let username=req.user
      let imagePath = `/uploads/${req.file.filename}`;
      let userid= req.user
     
      console.log("id is",req.user)
      let user=await User.findOne({_id:userid})
       console.log("user is",user._id)
      let store= await new Store({
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
        let products = await Store.find();
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

    
    let cartProductIds = user.cart;

    
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
        item.qnt -= 1; 
        await user.save()
    let qnt=item.qnt
    res.json({msg:'item updated',qnt});
    } else {
       
        user.cart = user.cart.filter(p => p.name !== product.name && p.price!==product.price && p.image!==product.image);
        await user.save()
        res.json({msg:'item removed'});
    }
   
    
  })


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});