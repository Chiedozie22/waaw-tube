const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const verifyEmail = require('../../utils/verifyEmail');
const randomstring = require('randomstring')

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'value',
    passReqToCallback: true
}, async (req, value, password, done) => {
    await User.findOne({$or: [{username: value}, {email: value}]})
    .then( async (user) => {
        if(!user) return done(null, false, req.flash('error-message', 'user not found'));
        await bcrypt.compare(password, user.password, (err, passwordMatch)=>{
            if(err) return done(err);

            if(!passwordMatch) return done(null, false, req.flash ('error-message', 'Invalid Password'));

            return done(null, user, req.flash('success-message', 'Login successful'));
        })
        // console.log(">>>>>>>>::: ", user)
    })
}));

// Needed for Login
passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

module.exports = {
    register: async (req, res, next) => {
        res.render('auth/register', {pageTitle: 'Register'});
    },

    login: async(req, res) => {
        res.render('auth/login', {pageTitle: 'Login'});
    },

    postRegister: async(req, res) => {
        console.log(req.body);
        let {email, username, password, confirmPassword} = req.body;

        if (password.length < 6) {
            req.flash('error-message', 'Enter a valid password');
            console.log(req.flash('error-message', 'Enter a valid password'))
             res.redirect('back');
        }
        if(password != confirmPassword){
            req.flash('error-message', 'Passwords do not match');
            return res.redirect('back');
        }
    
        let usernameExists = await User.findOne({username:username});
        let emailExists = await User.findOne({email:email});
    
        if (usernameExists){
            req.flash('error-message', 'Username already exist!!');
            return res.redirect('back');
        }
        if (emailExists){
            req.flash('error-message', 'Email already exist!!');
            return res.redirect('back');
        }

    // Hash Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const secretToken = randomstring.generate();

    let newUser = new User({
        username:username,
        email:email,
        secretToken: secretToken,
        password:hashedPassword,
    });
    
    await verifyEmail(req, username, email, secretToken)

    await newUser.save();

    if(!newUser){
        req.flash('error-message', 'Something Went Wrong, Please try again');
        return res.redirect('back');
    }

    req.flash('success-message', 'User created!!');
        return res.redirect('/auth/login');
    },

    /* Alternative way to code post Register user
        try{}
        catch(err){
            console.log(err);
        }
    */
    postLogin: async(req, res) => {
        
    },

    forgotPassword: async(req, res) => {

    },
}