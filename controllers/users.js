const User = require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{   
    res.render("users/signup.ejs");
}



module.exports.signup=async(req,res)=>{
    try{
        let{username, email, password} = req.body;
        const newUser=new User({username, email});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to the Wanderlust");
            res.redirect("/listings");
        });
        
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
};
module.exports.renderLoginForm=(req,res)=>{   
    res.render("users/login.ejs");
};
// module.exports.login=(req,res)=>{
//     req.flash("success", "Welcome back! to Wanderlust");
//     let redirectUrl = res.locals.redirectUrl || "/listings";
//     res.redirect(redirectUrl);
// };
module.exports.login = (req, res) => {
    console.log("LOGIN CONTROLLER REACHED");
    console.log("Headers already sent:", res.headersSent);
    console.log("Saved redirect:", res.locals.redirectUrl);

    req.flash("success", "Welcome back to Wanderlust");

    const redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","successfully logged out");
        res.redirect("/listings");
    });
};