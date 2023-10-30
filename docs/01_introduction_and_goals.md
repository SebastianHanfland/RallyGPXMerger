# Introduction and Goals

This tool aims to merge gpx segments (without timestamps) into track.
Each track consists of one or multiple segments.
The user can specify extra metadata like number of people or expected finish time. 

## Requirements Overview

While planning a rally, the route is something easy to plan, with tools like google or http://brouter.de/brouter-web.
Time stamps can be added with tools like https://gotoes.org/strava/uploadProgress.php
The problem this tool solves, is to calculate the times for a rally, when each branch should start.

## Quality Goals

A person without a lot of technical knowledge should be able to easily use the tool.
No code needs to be installed to use the functionality.

## Stakeholders

| Role/Name  | Expectations                                     |
|------------|--------------------------------------------------|
| User       | Planing a rally easily with merging gpx segments |
| Maintainer | Being able to maintain the code long term        |
