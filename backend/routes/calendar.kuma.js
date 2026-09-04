const { google } = require('googleapis');
const router = require('express').Router();

const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_CAL_KUMA_PRIVATE_KEY.split(String.raw`\n`).join('\n');

// GOOGLE CALENDAR INTEGRATION
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CAL_KUMA_CLIENT_EMAIL;
const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_CAL_KUMA_PROJECT_NUMBER;
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CAL_KUMA_CALENDAR_ID;

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
    calendar.events.list({
        calendarId: GOOGLE_CALENDAR_ID,
        timeMin: start,
        timeMax: end,
        singleEvents: true,
        orderBy: 'startTime',
    }, (error, result) => {
        if (error) {
            res.send(JSON.stringify({ error: error }));
        } else {
            if (result.data.items.length) {
                const filteredByRestaurant = result.data.items.filter((i) => {
                    const restaurantLowerCase = i.summary?.toLowerCase() || '';
                    return restaurantLowerCase.includes(req.params.location.toLowerCase());
                })
                const mappedEvents = filteredByRestaurant.map((i) => {
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
                res.send(JSON.stringify({ events: result.data.items, mappedEvents }));
            } else {
                // no event, return empty events array
                res.send(JSON.stringify({ events: result.data.items }));
            }
        }
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