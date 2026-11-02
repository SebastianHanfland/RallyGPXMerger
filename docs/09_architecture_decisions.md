# Architecture Decisions

## React, Redux, and localStorage setup

We chose a browser-based setup with React, Redux Toolkit, and `localStorage`.

- (+) easy to use for everyone
- (+) a simple way to create a UI
- (-) extra setup for react instead of a script

## Small JSON backend instead of uploading plans to GitHub

- (-) extra work
- (-) more complexity in the code
- (+) ease of use, no github account for users required anymore
- (+) separates plan persistence from frontend deployments
- (+) avoids requiring users to have GitHub accounts
