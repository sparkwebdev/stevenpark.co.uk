const fs = require("fs");
const crypto = require("crypto");
const path = require('path');
const scrape = require('html-metadata');
const escape = require('./escape');

const linkPreview = (link, callback) => {
  // Helper function to format links
  const format = (metadata) => {
    let title = escape((metadata.openGraph ? metadata.openGraph.title : null) || metadata.general.title || "");
    let author = escape(((metadata.jsonLd && metadata.jsonLd.author) ? metadata.jsonLd.author.name : null) || "");
    let description = escape(((metadata.openGraph ? metadata.openGraph.description : "") || metadata.general.description || "").trim());
    if (description.length > 140) {
      description = description.replace(/^(.{0,140})\s.*$/s, '$1') + '…';
    }
    return  `
      <a class="card-link" href="${link}">` + 
        `<svg aria-hidden="true" focusable="false" class="card-link__icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 122.88 121.93" xml:space="preserve"><g><path d="M8.33,0.02h29.41v20.6H20.36v80.7h82.1V84.79h20.36v37.14H0V0.02H8.33L8.33,0.02z M122.88,0H53.3l23.74,23.18l-33.51,33.5 l21.22,21.22L98.26,44.4l24.62,24.11V0L122.88,0z"/></g></svg>` + 
        `<strong class="card-link__title">${title}</strong><br>` + 
        (author ? `<em class="card-link__author">— by ${author}</em><br />` : ``) + 
        (description ? `<span class="card-link__description">${description}</span><br />` : ``) + 
        `<span class="card-link__url" aria-hidden="true">${link}</span>
      </a>
    `.replace(/[\n\r]/g, ' ');
  }
  
  // Hash the link URL (using SHA1) and create a file name from it
  let hash = crypto.createHash('sha1').update(link).digest('hex');
  let file = path.join('src/_links', `${hash}.json`);
  if (fs.existsSync(file)) {
    // File with cached metadata exists
    console.log(`[linkPreview] Using persisted data for link ${link}.`);
    fs.readFile(file, (err, data) => {
      if (err) callback("Reading persisted metadata failed", `<div style="color:#ff0000; font-weight:bold">ERROR: Reading persisted metadata failed</div>`);
      // Parse file as JSON, pass it to the format function to format the link
      callback(null, format(JSON.parse(data.toString('utf-8'))));
    });
  } else {
    // No cached metadata exists
    console.log(`[linkPreview] No persisted data for ${link}, scraping.`);
    scrape(link).then((metadata => {
      if (!metadata) callback ("No metadata", `<div style="color:#ff0000; font-weight:bold">ERROR: Did not receive metadata</div>`);
      // First, store the metadata returned by scrape in the file
      fs.writeFile(file, JSON.stringify(metadata, null, 2), (err) => { /* Ignore errors, worst case we parse the link again */ });
      // Then, format the link
      callback(null, format(metadata)); 
    })).catch(error => console.log(error.message));
  }  
}

module.exports = linkPreview; 