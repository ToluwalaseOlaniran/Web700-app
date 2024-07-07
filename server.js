/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Toluwalase Olaniran Martins Student ID: 104360235 Date: 06/07/2024
*  Online (vercel) Link: ________________________________________________________
*********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var collegeData = require("./modules/collegeData");

app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));

// Define routes with try/catch blocks for error handling
app.get("/students", async (req, res) => {
    try {
        if (req.query.course) {
            const data = await collegeData.getStudentsByCourse(req.query.course);
            res.json(data);
        } else {
            const data = await collegeData.getAllStudents();
            res.json(data);
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error: " + err });
    }
});

app.get("/tas", async (req, res) => {
    try {
        const data = await collegeData.getTAs();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error: " + err });
    }
});

app.get("/courses", async (req, res) => {
    try {
        const data = await collegeData.getCourses();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error: " + err });
    }
});

app.get("/student/:num", async (req, res) => {
    try {
        const data = await collegeData.getStudentByNum(req.params.num);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error: " + err });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});

app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addStudent.html"));
});

app.post("/students/add", async (req
