#!/usr/bin/env node

async function fetchData(url) {
    let returnData;
    try {
        await fetch(url)
            .then(async function (result) {
                await result
                    .json()
                    .then(function (data) {
                        returnData = data;
                    })
                    .catch(function (error) {
                        throw new Error(error);
                    });
            })
            .catch(function (error) {
                throw new Error(error);
            });
    } catch (error) {
        throw new Error(error);
    }
    return returnData;
}

function showData(data) {
    console.log("Output: ");
    data.forEach((element) => {
        if (element.type === "WatchEvent") {
            console.log(`- Started ${element.repo.name}`);
        } else if (element.type === "IssuesEvent") {
            let actionName =
                element.payload.action.charAt(0).toUpperCase() +
                element.payload.action.slice(1);
            console.log(`- ${actionName} an issue in ${element.repo.name}`);
        } else if (element.type === "PushEvent") {
            console.log(
                `- Pushed ${element.payload.commits.length} commits to ${element.repo.name}`
            );
        } else if (element.type === "ForkEvent") {
            console.log(`- Forked ${element.repo.name}`);
        } else if (element.type === "CreateEvent") {
            console.log(
                `- Created ${element.payload.ref_type} in ${element.repo.name}`
            );
        } else {
            console.log(
                `- ${element.type.replace("Event", "")} in ${element.repo.name}`
            );
        }
    });
}

async function cliLogic() {
    let argument = process.argv.slice(2);
    if (argument && argument[0]) {
        let userName = argument[0].toLowerCase();
        let fetchUrl = `https://api.github.com/users/${userName}/events`;
        let data = await fetchData(fetchUrl);
        showData(data);
    } else {
        console.warn("You haven't added any username to see their details");
    }
}

cliLogic();
