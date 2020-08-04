---
title: New site update
subtitle: I've updated my site, moving from WordPress to a much simpler (and quicker) Eleventy static site, deployed on Netlify.
date: 2020-08-04
tags: ['Jamstack', 'Netlify', 'Eleventy']
---

I use WordPress for the majority of my client sites, but serving my own site with it felt like a little overkill for what I needed. I have been wanting to try a Jamstack-based site along with the deployment/automation benefits offered by something like Netlify. And with this site update I now have faster, more secure site.

## The Tech Stack

For the static site generation I decided to use [Eleventy](https://www.11ty.dev/) — I'd heard good things about it and had played around with it previously. It's super simple and very low-configuarion but still very flexible. For the templating I used [Nunjucks](https://mozilla.github.io/nunjucks/).

To keep things speedy, the site has various performance focused techniques including inlined critical CSS, minified HTML and a very small amount of vanilla JavaScript. SASS is used, integrating some of principles of Andy Bell's [Cube CSS](https://piccalil.li/blog/cube-css/) methodology, which I've been liking the look of — I'm not quite all-in on it's principles just yet but it feels very aligned with how I write CSS.

The site is deployed/hosted on [Netlify](https://www.netlify.com/) and I've integrated a few of the the platform's useful plugins:

- 'Is Website Vulnerable' by erezrokah — 
*"A Netlify plugin to check if a Website uses vulnerable JavaScript libraries"*
- 'A11y' by sw-yx — 
*"Build a more accessible web! Run your critical pages through pa11y and fail build if accessibility failures are found"*
- 'Checklinks' by munter —
*"Checklinks helps you keep all your asset references correct and avoid embarrassing broken links to your internal pages, or even to external pages you link out to"*
- 'HTML Validate' by oliverroick — 
*"Validate HTML generated by your build"*

## Speed and Accessibility Improvements

As the site is now static HTML, with various build-step checks, it benefits from a big improvement in performance metrics. The home page, for example, gets a [Lighthouse](https://developers.google.com/web/tools/lighthouse) score of 100&hellip; 😍

![Screengrab showing a Gogle Lighthouse performance metrics score of 100](/assets/img/lighthouse-100.png)

Some of the inner pages fall slightly below this, due to some required work needed on responsive images, but I'm planning on fixing this next.

## Shout outs

A big help in learning Eleventy was some techniques from both Max Boeck's '[eleventastic](https://github.com/maxboeck/eleventastic)' theme and Andy Bell's '[Learn Eleventy From Scratch](https://piccalil.li/course/learn-eleventy-from-scratch/)' tutorial.

## Still to do

I'm rebuilding with an Agile approach, so it's very much a work in progress. Next steps for the build are:

- <del>Integrate a blog</del> <ins>Done</ins>
- Responsive images, served scaled and optimised as part of the build process
- Re-try the Netlify a11y plugin to bake-in accessibility tests at build/deployment (currenty seems a bit buggy?) 
- HTML validation coverage is failing due to `<figcaption>` elements not being direct descendents of `<figure>` elements, so a rework is needed
- Revisit design colour scheme/fonts
- Progressively enhance with some design features