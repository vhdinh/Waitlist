const { google } = require('googleapis');
const router = require('express').Router();

// uncomment when making commits to get credentials for production
const secrets = require('/etc/secrets/reservation-calendar.json');
const GOOGLE_PRIVATE_KEY = secrets ? secrets.private_key.replace(/\\n/g, '\n') : process.env.private_key.replace(/\\n/g, '\n') ? process.env.GOOGLE_CAL_KUMA_PRIVATE_KEY.replace(/\\n/g, '\n') : '';


// uncomment for local dev
// const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_CAL_KUMA_PRIVATE_KEY.split(String.raw`\n`).join('\n');

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
                    const restaurantLowerCase = i.summary.toLowerCase();
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
    const auth = new google.auth.GoogleAuth({
        // comment out for local dev
        keyFile: '/etc/secrets/reservation-calendar.json',
        // uncomment for local dev
        // keyFile: '../backend/reservation-calendar.json',
        scopes: 'https://www.googleapis.com/auth/calendar',
    });
    auth.getClient().then(a=> {
        calendar.events.insert({
            auth:a,
            calendarId: GOOGLE_CALENDAR_ID,
            resource: newEvent,
        }, function(err, event) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return res.status(400).json('Error: ' + err)
            } else {
                console.log('Event created: %s', event.data);
                res.jsonp("Event successfully created!");
            }
        });
    })
})

router.route('/update-event').post((req, res) => {
    console.log('route: /google-calendar/update-event', req.body);
    const updatedBody = {...req.body};
    const auth = new google.auth.GoogleAuth({
        // comment out for local dev
        keyFile: '/etc/secrets/reservation-calendar.json',
        // uncomment for local dev
        // keyFile: '../backend/reservation-calendar.json',
        scopes: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
        ],
    });

    auth.getClient().then(a=> {
        calendar.events.patch({
            auth:a,
            calendarId: GOOGLE_CALENDAR_ID,
            eventId: req.body.id,
            requestBody: updatedBody,
        }, function(err, event) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                res.status(400).json('Error: ' + err)
            } else {
                console.log('Event updated: %s', JSON.stringify(event.data));
                res.jsonp("Event successfully updated!");
            }
        });
    })
})

router.route('/delete-event/:id').delete((req, res) => {
    console.log('route: /google-calendar/delete-event params', req.params.id);
    const auth = new google.auth.GoogleAuth({
        // comment out for local dev
        keyFile: '/etc/secrets/reservation-calendar.json',
        // uncomment for local dev
        // keyFile: '../backend/reservation-calendar.json',
        scopes: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
        ],
    });
    auth.getClient().then(a=> {
        calendar.events.delete({
            auth: a,
            calendarId: GOOGLE_CALENDAR_ID,
            eventId: req.params.id,
        }, function (err, event) {
            console.log('----after--trying-to-delete----', event, err);
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                res.status(400).json('Error: ' + err)
            } else {
                console.log('Event deleted: %s', JSON.stringify(event.data));
                res.jsonp("Event successfully deleted!");
            }
        })
    });
})

module.exports = router;