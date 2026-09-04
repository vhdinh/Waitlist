const { google } = require('googleapis');
const router = require('express').Router();

const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_CAL_OCHA_PRIVATE_KEY.split(String.raw`\n`).join('\n');

// GOOGLE CALENDAR INTEGRATION
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CAL_OCHA_CLIENT_EMAIL;
const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_CAL_OCHA_PROJECT_NUMBER;
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CAL_OCHA_CALENDAR_ID;
const GOOGLE_CALENDAR_CATERING_ID = process.env.GOOGLE_CAL_OCHA_CATERING_CALENDAR_ID;

const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY,
    SCOPES
);

const calendar = google.calendar({
    version: 'v3',
    project: GOOGLE_PROJECT_NUMBER,
    auth: jwtClient
});

// Write-scope auth client for add/update/delete below, built once from the
// same in-memory credentials as the read-only jwtClient above instead of a
// keyFile on disk. This also removes the need to write the service account
// key out to a JSON file on every server boot (see server.js) just so these
// handlers could read it back in.
const writeJwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY,
    [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
    ]
);

router.route('/:location/:startOfMonth/:endOfMonth').get((req, res) => {
    const start = req.params.startOfMonth;
    const end = req.params.endOfMonth;
    const calendarIds = [GOOGLE_CALENDAR_ID, GOOGLE_CALENDAR_CATERING_ID];
    //
    //
    //
    // Map each ID to an ongoing asynchronous API call promise
    const fetchPromises = calendarIds.map(async (id) => {
        try {
            const response = await calendar.events.list({
                calendarId: id,
                timeMin: start,
                timeMax: end,
                singleEvents: true,
                orderBy: 'startTime',
            });
            // Return events injected with their source calendar ID for clear tracking
            return (response.data.items || []).map(event => ({
                ...event,
                sourceCalendar: id === GOOGLE_CALENDAR_ID ? 'reservation' : 'banquet'
            }));
        } catch (error) {
            console.error(`Failed to fetch calendar ${id}:`, error.message);
            return []; // Return empty array to prevent one failing calendar from breaking the loop
        }
    });

    // Resolve all API requests concurrently (reservation and banquet)
    Promise.all(fetchPromises).then((resultsArray) => {
        // Flatten the multi-dimensional array into a single event list
        const allEvents = resultsArray.flat();

        // Sort the combined event list chronologically by start date/time
        allEvents.sort((a, b) => {
            const startA = a.start.dateTime || a.start.date;
            const startB = b.start.dateTime || b.start.date;
            return new Date(startA) - new Date(startB);
        });


        if (allEvents.length) {
            const mappedEvents = allEvents.map((i) => {
                const newStartDate = new Date(i.start.dateTime || i.start.date);
                const unixStartTime = Math.floor(newStartDate.getTime())
                const newEndDate = new Date(i.end.dateTime || i.start.date);
                const unixEndTime = Math.floor(newEndDate.getTime())
                return {
                    ...i,
                    firstName: i.summary?.split(' ').slice(1, -1).join(' '),
                    phoneNumber: i.description?.split('\n').shift(),
                    partySize: i.summary?.split(' ').pop().replace(/\D/g, ''),
                    note: i.description?.split('\n').slice(1).join('\n') || '',
                    startTime: unixStartTime,
                    endTime: unixEndTime,
                };
            })
            res.send(JSON.stringify({ events: allEvents, mappedEvents }));
        } else {
            // no event, return empty events array
            res.send(JSON.stringify({ events: [] }));
        }
    }).catch((error) => {
        console.error('Failed to fetch calendars:', error);
        res.status(500).json({ error: error.message });
    });
});

router.route('/add-event').post((req, res) => {
    const newEvent = {
        summary: req.body.summary,
        description: req.body.description,
        start: req.body.start,
        end: req.body.end,
        attendees: [],
        reminders: {
            useDefault: true,
        },
        eventType: 'default'
    };
    calendar.events.insert({
        auth: writeJwtClient,
        calendarId: GOOGLE_CALENDAR_ID,
        resource: newEvent,
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return res.status(400).json('Error: ' + err)
        } else {
            console.log('Event created');
            res.jsonp("Event successfully created!");
        }
    });
})

router.route('/add-catering-event').post((req, res) => {
    const newEvent = {
        summary: req.body.summary,
        description: req.body.description,
        start: req.body.start,
        end: req.body.end,
        attendees: [],
        reminders: {
            useDefault: true,
        },
        eventType: 'default'
    };
    calendar.events.insert({
        auth: writeJwtClient,
        calendarId: GOOGLE_CALENDAR_CATERING_ID,
        resource: newEvent,
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return res.status(400).json('Error: ' + err)
        } else {
            console.log('Catering event created');
            res.jsonp("Event successfully created!");
        }
    });
})

router.route('/update-event').post((req, res) => {
    const updatedBody = { ...req.body };
    calendar.events.patch({
        auth: writeJwtClient,
        calendarId: GOOGLE_CALENDAR_ID,
        eventId: req.body.id,
        requestBody: updatedBody,
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            res.status(400).json('Error: ' + err)
        } else {
            console.log('Event updated');
            res.jsonp("Event successfully updated!");
        }
    });
})

router.route('/update-catering-event').post((req, res) => {
    const updatedBody = { ...req.body };
    calendar.events.patch({
        auth: writeJwtClient,
        calendarId: GOOGLE_CALENDAR_CATERING_ID,
        eventId: req.body.id,
        requestBody: updatedBody,
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            res.status(400).json('Error: ' + err)
        } else {
            console.log('Catering event updated');
            res.jsonp("Event successfully updated!");
        }
    });
})

router.route('/delete-catering-event/:id').delete((req, res) => {
    calendar.events.delete({
        auth: writeJwtClient,
        calendarId: GOOGLE_CALENDAR_CATERING_ID,
        eventId: req.params.id,
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            res.status(400).json('Error: ' + err)
        } else {
            console.log('Event deleted');
            res.jsonp("Event successfully deleted!");
        }
    })
})

router.route('/delete-event/:id').delete((req, res) => {
    calendar.events.delete({
        auth: writeJwtClient,
        calendarId: GOOGLE_CALENDAR_ID,
        eventId: req.params.id,
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            res.status(400).json('Error: ' + err)
        } else {
            console.log('Event deleted');
            res.jsonp("Event successfully deleted!");
        }
    })
})

module.exports = router;