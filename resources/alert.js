const AWS = require("aws-sdk");
const fetch = require("node-fetch");
const crypto = require("crypto");
const slackChannel = process.env.SLACK_CHANNEL_URL;
const githubSecret = process.env.WEBHOOK_SECRET;

const verifyGitHubSignature = (req = {}, secret = "") => {
  const sig = req.headers["X-Hub-Signature"];
  const hmac = crypto.createHmac("sha1", secret);
  const digest = Buffer.from(
    "sha1=" + hmac.update(JSON.stringify(req.body)).digest("hex"),
    "utf8"
  );
  const checksum = Buffer.from(sig, "utf8");
  console.log({ checksum, digest });
  console.log("timing", crypto.timingSafeEqual(digest, checksum));
  if (
    checksum.length !== digest.length
    // || !crypto.timingSafeEqual(digest, checksum)
  ) {
    return false;
  } else {
    return true;
  }
};

const migrationCommit = (commits) => {
  const allModifiedFiles = commits.map((c) => c.modified);
  console.log({ allModifiedFiles: [].concat.apply([], allModifiedFiles) });
  if ([].concat.apply([], allModifiedFiles).includes("prisma/schema.prisma")) {
    return true;
  }
  return false;
};

const main = async function (event, context) {
  console.log(JSON.stringify(event, null, 2));
  const secret = event.headers["X-Hub-Signature"];
  if (!verifyGitHubSignature(event, githubSecret)) {
    return {
      statusCode: 403,
    };
  }
  try {
    var method = event.httpMethod;

    if (method === "POST") {
      if (event.path === "/") {
        const body = JSON.parse(event.body);
        const { ref, commits } = body;
        console.log({ ref, commits });
        if (ref.includes("master") && commits.length !== 0) {
          console.log("Pushed to Master");
          console.log("migrated?", migrationCommit(commits));
          if (migrationCommit(commits)) {
            // send message to the Slack
            await fetch(slackChannel, {
              method: "post",
              body: JSON.stringify({
                text: "<!here> DB Migration Alert: the commit that has been pushed to the master branch includes DB migration",
              }),
              headers: { "Content-Type": "application/json" },
            });
          }
        }
        return {
          statusCode: 200,
          headers: {},
          body: JSON.stringify("success"),
        };
      }
    }

    return {
      statusCode: 400,
    };
  } catch (error) {
    var body = error.stack || JSON.stringify(error, null, 2);
    return {
      statusCode: 400,
      headers: {},
      body: JSON.stringify({ error: body }),
    };
  }
};

module.exports = { main, verifyGitHubSignature };
