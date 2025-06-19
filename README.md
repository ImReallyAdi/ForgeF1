# ForgeGithub

An unofficial ForgeScript extension to **listen to GitHub Webhook events** such as `push`, `pull_request`, and more.

## :package: Features

- :white_check_mark: Supports GitHub Webhooks natively
- :mag: Access payloads with enums like `$newPush[property]` and `$newPullRequest[property]`
- :jigsaw: Command system to handle GitHub events inside ForgeScript
- :rocket: Perfect for CI updates, project changelogs, or contributor automation

## :gear: Installation

```bash
npm install github:Clyders/ForgeGithub#dev
````

## :test_tube: Usage Example

### 1. Extend Your Client

```js
const { ForgeGithub } = require("@tryforge/forge.github");

const client = new ForgeClient({
...
extensions: [
new ForgeGithub({
  port: 80
})
],
});
```

### 2. Create a GitHub Webhook

* Go to your GitHub repo → Settings → Webhooks
* Set URL: `https://your-public-url/github`
* Content type: `application/json`
* Select events: `Push`, `Pull Request`, or all
* Save

### 3. Use Functions in ForgeScript

```js
$newPush[head_commit.message] // => "test"
$newPullRequest[pull_request.title] // => "Added new thingy"
```

> These functions only work right after receiving a GitHub event.

---

## :brain: Functions

| Function                    | Description                                          |
| ----------------------------|------------------------------------------------------|
| `$newPush[property]`        | Get data from latest push event payload              |
| `$newPullRequest[property]` | Get data from latest pull request event              |
| `$pushCommitCount`          | Get count of commits in the latest push event        |
| `$githubEventType`          | Get type of the latest GitHub event                  |
| `$newCreate[property]`      | Get data from branch/tag creation event              |
| `$newDelete[property]`      | Get data from branch/tag deletion event              |
| `$newRepository[property]`  | Get data from repository changes (e.g., rename)      |
| `$newLabel[property]`       | Get data from label created/edited/deleted event     |
| `$newMilestone[property]`   | Get data from milestone opened/closed event          |
| `$newProject[property]`     | Get data from project created/updated/deleted event  |
| `$newProjectCard[property]` | Get data from project card moved/updated event       |
| `$newFork[property]`        | Get data from fork event                             |
| `$newWatch[property]`       | Get data from watch (subscription) event             |
| `$newComment[property]`     | Get data from issue comment event                    |
| `$newPRReview[property]`    | Get data from pull request review event              |
| `$newCommit[property]`      | Get data from a new commit in push events            |
| `$newDiscussion[property]`  | Get data from discussion event                       |
| `$newIssue[property]`       | Get data from issue creation/modification event      |
| `$newPullRequest[property]` | Get data from new pull request event                 |

> Each of these functions corresponds to a GitHub event of the same name, ensuring consistency between event triggers and their respective handlers.

---

## :shield: Requirements

* Node.js 18+
* Public port (you can use [Ngrok](https://ngrok.com) for local testing)

---

## :handshake: Contribution

* Open issues or PRs for suggestions
* Custom event ideas welcome!