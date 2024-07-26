/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Toluwalase Olaniran Martins Student ID: 104360235 Date: 06/07/2024
*  Online (vercel) Link: https://web700-bh4v0yto3-toluwalase-olaniran-martins-projects.vercel.app/
*********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var collegeData = require("./modules/collegeData");

// Require express-handlebars
var exphbs = require("express-handlebars");

// Set up express-handlebars
app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set("view engine", ".hbs");

app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));

// Middleware to set activeRoute
app.use(function(req, res, next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
});

// Define routes with try/catch blocks for error handling
app.get("/students", async (req, res) => {
    try {
        let data;
        if (req.query.course) {
            data = await collegeData.getStudentsByCourse(req.query.course);
        } else {
            data = await collegeData.getAllStudents();
        }
        res.render("students", {students: data});
    } catch (err) {
        res.render("students", {message: "no results"});
    }
});

app.get("/courses", async (req, res) => {
    try {
        const data = await collegeData.getCourses();
        res.render("courses", {courses: data});
    } catch (err) {
        res.render("courses", {message: "no results"});
    }
});

app.get("/course/:id", async (req, res) => {
    try {
        const data = await collegeData.getCourseById(req.params.id);
        res.render("course", { course: data });
    } catch (err) {
        res.status(500).send("Course not found");
    }
});

app.get("/student/:studentNum", (req, res) => {
    collegeData.getStudentByNum(req.params.studentNum).then((student) => {
        collegeData.getCourses().then((courses) => {
            res.render("student", { student, courses });
        }).catch((err) => {
            res.render("student", { message: "Error retrieving courses" });
        });
    }).catch((err) => {
        res.render("student", { message: "Student not found" });
    });
});

app.post("/students/add", async (req, res) => {
    try {
        await collegeData.addStudent(req.body);
        res.redirect("/students");
    } catch (err) {
        res.status(500).send("Unable to add student");
    }
});

app.post("/student/update", async (req, res) => {
    try {
        await collegeData.updateStudent(req.body);
        res.redirect("/students");
    } catch (err) {
        res.status(500).send("Unable to update student");
    }
});

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo");
});

app.get("/students/add", (req, res) => {
    res.render("addStudent");
});

app.use((req, res) => {
    res.status(404).send("Oops, looks like you are lost.");
});

// Start the server
collegeData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("server listening on port: " + HTTP_PORT);
    });
}).catch((err) => {
    console.error("Unable to start server: " + err);
});
