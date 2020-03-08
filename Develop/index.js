var inquirer = require("inquirer");
var fs = require("fs");
var axios = require("axios");
var pdf = require('html-pdf');
 
var generateHTML = require("./generateHTML");

const userData = {};
var starCount = 0;

inquirer
    .prompt([
        {
            type: "input",
            message: "What is your Github username?",
            name: "username"

        },
        {
            type: "input",
            message: "What is your favorite color?",
            name: "color"
        }
    ]).then(function (userInput) {
        axios.get(`https://api.github.com/users/${userInput.username}`).then(function (response1) {

            axios.get(`https://api.github.com/users/${userInput.username}/starred`).then(function (response2) {
                const data = response1.data;
                userData.color = userInput.color;
                userData.avatar_url = data.avatar_url;
                userData.name = data.name;
                userData.company = data.company;
                userData.location = data.location;
                userData.bio = data.bio;
                userData.public_repos = data.public_repos;
                userData.followers = data.followers;
                userData.following = data.following;
                userData.blog = data.blog;
                userData.githubLink = data.html_url;
                for (let i = 0; i < response2.data.length; i++) {
                    starCount += response2.data[i].stargazers_count;
                }
                userData.starred = starCount;
                // console.log(data);
                // console.log("Response2", response2);
                // console.log(userData);
                var finalHTML = generateHTML(userData);
                fs.writeFile("./index.html", finalHTML, function (err) {
                    if (err) {
                        return err;
                    }
                });
            });
            
        });
    });
    
    
   