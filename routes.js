var passport = require('passport');
var User = require('./models/User');
var PerformanceReview = require('./models/PerformanceReview');

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index', { user: req.user, isAuthenticated: req.isAuthenticated() });
    });

    app.get('/register', function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect("/profile")
        } else {
            res.render('register', { isAuthenticated: false });
        }
    });

    app.post('/register', function(req, res) {
        const { name, email, isAdmin } = req.body;
        User.register(new User({ name, email, isAdmin: isAdmin === "on" ? true : false, username: email }), req.body.password, function(err, user) {
            if (err) {
                return res.send("Failed to created user");
            } else {
                if (isAdmin) {
                    return res.send("Admin created successfuly");
                }
                return res.send("Employee created successfuly");
            }
        });
    });


    app.post("/user/:employeeId", async(req, res) => {
        const { employeeId } = req.params;
        const { isAdmin } = req.query;
        try {
            await User.findOneAndUpdate({ _id: employeeId }, { isAdmin: isAdmin === "true" ? true : false });
            res.send("updated successfuly")
        } catch (err) {
            res.send("Failed to update")
        }
    });

    app.post('/employee/performance-reviews/:reviewId/:reviewerId', async(req, res) => {
        const { reviewId, reviewerId } = req.params;
        const { feedback } = req.body;
        try {
            await PerformanceReview.findOneAndUpdate({ _id: reviewId, "reviewers.reviewer": reviewerId }, { $set: { "reviewers.$.feedback": feedback } });
            res.send("Feedback saved successfuly")
        } catch (err) {
            res.send("Failed to save Feedback")
        }
    });


    app.post('/employee/addreview/:employeeId', async function(req, res) {
        const { employeeId } = req.params;
        const { reviewers } = req.body;
        let reviews;

        if (typeof reviewers === 'string') {
            reviews = [{ reviewer: reviewers }];
        } else {
            // Handle the case when reviewers is an array of strings
            reviews = reviewers.map(reviewer => ({ reviewer }));
        }


        try {
            if (req.isAuthenticated()) {
                let review = await PerformanceReview.create({ employeeId, reviewers: reviews });
                res.send("Reviewers assigned successfuly")
            } else {
                res.send("Failed to assign reviewers")
            }
        } catch (err) {
            res.send(err)
        }
    });


    app.get('/login', function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect("/profile")
        } else {
            res.render('login', { user: req.user, isAuthenticated: false });
        }
    });

    app.post('/login', passport.authenticate('local', {
        failureRedirect: '/login-failure',
        successRedirect: '/profile',
    }), function(req, res) {
        res.redirect('/');
    });

    app.get('/logout', function(req, res, next) {
        req.logout(function(err) {
            if (err) {
                console.log(err)
                return next(err);
            }
            res.redirect('/');
        });
    });

    app.get('/login-failure', (req, res, next) => {
        res.send('Login Attempt Failed.');
    });

    app.get('/profile', async function(req, res) {
        if (req.isAuthenticated()) {
            if (req.user.isAdmin) {
                let employees = await User.find();
                let reviews = await PerformanceReview.find().populate({ path: 'employeeId' }).populate({ path: 'reviewers.reviewer' }).exec();
                let adminReviews = await PerformanceReview.find({ "reviewers.reviewer": req.user._id }).populate({ path: 'employeeId' }).exec();
                res.render("admin", { user: req.user, employees: employees, adminReviews, reviews, isAuthenticated: true })
            } else {
                let reviews = await PerformanceReview.find({ "reviewers.reviewer": req.user._id }).populate({ path: 'employeeId' }).exec();
                res.render("employee", { user: req.user, reviews: reviews, isAuthenticated: true })
            }
        } else {
            res.redirect("/");
        }
    })
}