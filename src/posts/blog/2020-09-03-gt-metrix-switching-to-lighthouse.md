---
title: GTmetrix major updates
subtitle: The popular performance testing tool is changing how it measures webpage performance, moving from PageSpeed/YSlow to Lighthouse.
date: 2020-09-03
tags: ['Performance', 'Tools']
---

I have been doing a lot of performance testing recently, using a combination of GTmetrix (which measures against Google's PageSpeed and Yahoo's YSlow) and Google's Lighthouse. Constantly switching between the two is a bit of a pain so I checked to see if GTmetrix has Lighthouse integration and, as luck would have it, it will soon. In fact they are moving their entire testing engine to Lighthouse. This will mean results will be a single main score, which they are calling the GTmetrix Grade, along with new Speed and Structure supplementary scores. The new scores will follow Lighthouse's [Core Web Vitals](https://web.dev/vitals/), with a focus on "how fast (your site) actually loads for your users".

Here's a screenshot of their new dashboard:

![GT Metrix ipcoming new dashboard showing a single primary score along with Core Web Vitals scores](/assets/img/gtmetrix-new-dashboard.png?nf_resize=fit&amp;w=750)

You can see the [full announcement on their blog](https://gtmetrix.com/blog/big-changes-are-coming-to-gtmetrix-lighthouse-new-test-locations-new-pro-plans-etc/), with the changes said to be 'coming soon'.

As they mention, Google has indicated that Core Web Vitals will likely influence their page ranking algorithm in the future, so all the more reason to make the switch and I'm looking forward to giving the new dashboard a try.