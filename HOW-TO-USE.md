# How to Use PR Tracker for a specific team

### 1. Update the code 
* Open index.js, and update the constants for Channel ID at the top, so they reflect the channel where you want your PR updates to post (you can find the channel ID by navigating to the channel in Slack's web app, and the ID is in the URL)

### 2. Install Zeit Now

### 3. Create a new deployment
* From the `nodeproj` directory, **deploy** your version of the code using `now -e "SLACK_TOKEN="{token}"`. This will set our Meetup OAuth token as an environment variable in your deployment.
* **Alias** the deployment to something useful using `now alias {url-or-your-new-deployment} My-custom-name`

### 4. Set up webhooks for repos you want to include
* From the GitHub website, go into the settings of a repo you want to include, add your alias URL and set the content type to application/json

### 5. Redeploy whenever you want, just use the same alias
And you'll never have to update the webhooks!
