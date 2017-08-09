const channelId = 'G6HMMGLRH'       ////// <<<<<< Change this to post to a different channel

var request = require('request')
var fs = require('fs')
var bodyParser = require('body-parser')
const express = require('express')
const router = express()
router.use(bodyParser.json())


var token = process.env.SLACK_TOKEN
var openPRs = {}

router.post('/', function (req, res) {

  var parsed = req.body
  if ((typeof(parsed.action) === "undefined") || 
      (parsed.action != "opened" && parsed.action != "closed")){
    res.send ("Hello! Send me your opened/closed PRs!")
  }
  else {
    var repoName = parsed.pull_request.base.repo.name
    var repoUrl = parsed.pull_request.base.repo.html_url
    var prName = parsed.pull_request.title
    var prUrl = parsed.pull_request.html_url
    var personName = parsed.pull_request.user.login

    if (parsed.action == "opened") {

      var timestamp

      res.send ("PR was opened!")

      request.post(
        'https://slack.com/api/chat.postMessage', 
        { form: { 
          token: token, 
          channel: channelId, 
          attachments: 
            "[{ 'fallback': 'Here is the PR info for an open PR', 'pretext': 'A PR is open for review', 'color': '#f44253', 'author_name': 'Repo: " + repoName + "', 'author_link': '" + repoUrl + "', 'title': 'PR Description: " + prName + "', 'title_link': '" + prUrl +"', 'fields': [{'title': 'Status:', 'value': 'Open','short': true}, {'title': 'Opened by:', 'value': '" + personName + "', 'short': true}] }]" } },
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
              timestamp = (JSON.parse(body)).ts
              openPRs[prUrl] = timestamp
              console.log(response.body)
          } else {
            console.log("An error occurred when contacting Slack!")
          }
        }
      )

    } else if (parsed.action == "closed") {

      res.send ("PR was closed!")

      request.post(
        'https://slack.com/api/chat.update', 
        { form: { 
          token: token, 
          channel: channelId, 
          ts: openPRs[prUrl],
          attachments: 
            "[{ 'fallback': 'Here is the PR info for a closed PR', 'pretext': 'This PR has been closed', 'color': '#14c944', 'author_name': 'Repo: " + repoName + "', 'author_link': '" + repoUrl + "', 'title': 'PR Description: " + prName + "', 'title_link': '" + prUrl +"', 'fields': [{'title': 'Status:', 'value': 'Closed','short': true}, {'title': 'Opened by:', 'value': '" + personName + "', 'short': true}] }]" } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                delete openPRs[prUrl]
            } else {
            console.log("An error occurred when contacting Slack!")
          }
        }
      )
    } 
  }
})

router.get('/', function (req, res) {
  res.send ("Hello, this is Brooke's Meetup Hackathon project for tracking PR's! POST your GitHub PR data here")
})


router.listen(3000, function () {
  console.log('Example router listening on port 3000!')
})



