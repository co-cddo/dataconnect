"use strict";

// This code sample uses the 'node-fetch' library:
// https://www.npmjs.com/package/node-fetch
//const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const assert = require('assert').strict;
const fs = require('fs');
// const Transfigurator = require("transfigure-json");

const key = '&key=3ae4187a0f91e476a544b57f2bf54a05';
const token = '&token=9ab77453293445f424c9a32b6300c94b18cedab80c84ab2714b93128fb846ab4';
const boardID = '61092d1bcc09f730525db75c';
// const labelsUrl = 'https://api.trello.com/1/boards/' + boardID +'/labels?&fields=name' + key + token

// async function getLabelsData(url) {
//   const response = await fetch(url);
//   return response.json();
// }

// const labels = getLabelsData(labelsUrl);

// console.log({ labels })

// function getLabels() {
//   fetch(labelsUrl, { method: 'GET' })
//   .then((response) => response.json())
//   .then((responseData) => {
//     // console.log(responseData);
//     return responseData;
//   })
//   // console.log(labels);
// }
// const labelsJ = getLabels()
// console.log(labelsJ);
// // const labelsDict = getLabels()
// console.log(labelsDict);


function eachDay() {
    const days = '[{ "id":"61092d1bcc09f730525db75e", "name":"Monday" }, { "id":"61092d1bcc09f730525db75f", "name":"Tuesday" }, { "id":"61092d1bcc09f730525db760", "name":"Wednesday" }, { "id":"61092d1bcc09f730525db761", "name":"Thursday" }, { "id":"61092d1bcc09f730525db762", "name":"Friday" }]';
    const dates = JSON.parse(days);

    for (let d = 0; d < dates.length; d++) {
        const list = dates[d]['id'];
        const day = dates[d]['name'].replace(/\s+/g, "").trim();
        const exp_path = '../app/views/'
        const dayFile = exp_path + day + '-events.html';
        const schedFile = exp_path + day + '-summary' + '-events.html';
        const buildFile = fs.writeFileSync((dayFile), ('<p><h2>' + day + '</h2></p>'), {flag: 'w+'}, err =>{});
        const buildsched = fs.writeFileSync((schedFile), ('<p><h2><a href="/' + day + '">' + day + "</a>" + '</h2></p>'), {flag: 'w+'}, err =>{});
        const url = 'https://api.trello.com/1/lists/' + list + '/cards?&fields=name&fields=desc&fields=idLabels' + key + token;
        
        // const write = fs.writeFileSync('schedule.txt', day, {flag: 'a+'}, err =>{});

        async function getDayEvents() {
            const response = await fetch(url);
            const data = await response.json();
            // console.log(data.length);

            for (let i = 0; i < data.length; i++) {
              const entryName = data[i]['name']
              const entryLink = day + '-' + entryName.replace(/[^a-zA-Z0-9]/g, " ").replace(/\s/g, '-').replace(/-+/g,'-');
              const entryTitle = '<h2><div id="' + entryLink + '">' + entryName + '</div>' + '</h2>';
              const summaryTitle = '<a href="' + "/" + day + "#" + entryLink + '">' + entryName + '</a>' + '<br>';
              const description = data[i]['desc'].replace(/##([^/\n]+)/g, '<b>$1</b>').replace(/(\r\n|\n|\r)/gm, "<br>\n").replace(/(<\/p>|<\/p>[\n]|<\/li>)<br>/g, '$1').replace(/<\/p>\n<br>\n<p>/g, '</p>\n<p>').replace(/(<br>\n<br>|<br><br>)/g, '<br>').replace(/http([^<]+)/g, '<a href="$&">$&</a>');
              const labelsArray = data[i]['idLabels'];
              // console.log(labelsArray);
                for (let l = 0; l < labelsArray.length; l++) {
                  console.log(labelsArray[l])
                  // async function getLabelName() {
                  //   const labelsUrl = 'https://api.trello.com/1/labels/' + labelsArray[l] +'?&fields=name' + key + token
                  //   const labels = await fetch(labelsUrl);
                  //   const labelName = await labels.json();
                  //   console.log(labelName);
                  // }
                  // getLabelName()
                }
                const listing = fs.writeFileSync((dayFile), entryTitle + description + '<br>' + '<br>Categories:</b>' + (data[i]['idLabels']) + '</p>', {flag: 'a+'}, err =>{});
                const summarylisting = fs.writeFileSync((schedFile), summaryTitle, {flag: 'a+'}, err =>{});
           }
        }
        getDayEvents();
    }
}   
eachDay();
