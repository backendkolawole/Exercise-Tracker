# Exercise Tracker

You can POST to /api/users with form data username to create a new user and the returned response will be an object with username and _id properties.

You can make a GET request to /api/users to get a list of all users.
Each element in the array returned from GET /api/users is an object literal containing a user's username and _id.

You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date and the response returned will be the user object with the exercise fields added. If no date is supplied, the current date will be used.

You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user and the return response will be a user object with a log array of all the exercises added with a count property representing the number of exercises that belong to that user.

Each item in the log array that is returned from GET /api/users/:_id/logs is an object that should have a description, duration, and date properties.

You can add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.
