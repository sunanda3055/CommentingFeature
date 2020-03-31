var commentsArray = [
    {
        "id": 1,
        "parent": null,
        "created": "2015-01-01",
        "modified": "2015-01-01",
        "file_name": "metadataeditor.txt",
        "content": "ISSUE : 103",
        "pings": [],
        "creator": 6,
        "fullname": "Simon Powell",
        "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
        "created_by_admin": false,
        "created_by_current_user": false,
        "is_new": false
    },
    {
        "id": 2,
        "parent": null,
        "created": "2015-01-02",
        "modified": "2015-01-02",
        "file_name": "tests.html",
        "content": "ISSUE : 107",
        "pings": [],
        "creator": 5,
        "fullname": "Administrator",
        "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
        "created_by_admin": true,
        "created_by_current_user": false,
        "is_new": false
    },
    {
        "id": 3,
        "parent": null,
        "created": "2015-01-03",
        "modified": "2015-01-03",
        "file_name": "index.js",
        "content": "ISSUE : 102",
        "pings": {
            3: 'Hank Smith',
        },
        "creator": 1,
        "fullname": "You",
        "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
        "created_by_admin": false,
        "created_by_current_user": true,
        "is_new": false
    },
    {
        "id": 4,
        "parent": 3,
        "created": "2015-01-04",
        "modified": "2015-01-04",
        "file_name": "",
        "content": "ISSUE: Include the survey details.",
        // "file_url": "http://www.w3schools.com/html/mov_bbb.mp4",
        // "file_mime_type": "video/mp4",
        "creator": 4,
        "fullname": "Todd Brown",
        "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
        "created_by_admin": false,
        "created_by_current_user": false,
        "is_new": true
    },
    {
        "id": 5,
        "parent": 4,
        "created": "2020-01-05",
        "modified": "2020-01-05",
        "file_name": "",
        "content": "Survey details are due with the surveyer.",
        "pings": [],
        "creator": 3,
        "fullname": "Hank Smith",
        "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
        "created_by_admin": false,
        "created_by_current_user": false,
        "is_new": true
    },
    {
        "id": 6,
        "parent": 1,
        "created": "2020-01-06",
        "modified": "2020-01-06",
        "file_name": "",
        "content": "ISSUE: Delay in production..",
        "pings": [],
        "creator": 2,
        "fullname": "Jack Hemsworth",
        "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
        "created_by_admin": false,
        "created_by_current_user": false,
        "is_new": false
    },
    {
        "id": 7,
        "parent": 1,
        "created": "2020-01-07",
        "modified": "2020-01-07",
        "file_name": "",
        "content": "Once all the tickets are closed, then we will move tickets.",
        "pings": [],
        "creator": 5,
        "fullname": "Administrator",
        "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
        "created_by_admin": true,
        "created_by_current_user": false,
        "is_new": false
    },
    {
        "id": 8,
        "parent": 6,
        "created": "2020-01-08",
        "modified": "2020-01-08",
        "file_name": "",
        "content": "We haven't verified by QA that it is completed at their end or not.",
        "pings": [],
        "creator": 1,
        "fullname": "You",
        "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
        "created_by_admin": false,
        "created_by_current_user": true,
        "is_new": false
    },
    {
        "id": 9,
        "parent": 8,
        "created": "2020-01-09",
        "modified": "2020-01-10",
        "file_name": "",
        "content": "QA require its time to accomplish the task.",
        "pings": [],
        "creator": 7,
        "fullname": "Bryan Connery",
        "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
        "created_by_admin": false,
        "created_by_current_user": false,
        "is_new": false
    },
    {
        "id": 10,
        "parent": 9,
        "created": "2020-01-10",
        "modified": "2020-01-10",
        "file_name": "",
        "content": "It is completed from my side.",
        "pings": [],
        "creator": 1,
        "fullname": "You",
        "profile_picture_url": "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
        "created_by_admin": false,
        "created_by_current_user": true,
        "is_new": false
    }
];

var usersArray = [
    {
        id: 1,
        fullname: "Current User",
        email: "current.user@viima.com",
        profile_picture_url: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
    },
    {
        id: 2,
        fullname: "Jack Hemsworth",
        email: "jack.hemsworth@viima.com",
        profile_picture_url: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
    },
    {
        id: 3,
        fullname: "Hank Smith",
        email: "hank.smith@viima.com",
        profile_picture_url: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
    },
    {
        id: 4,
        fullname: "Todd Brown",
        email: "todd.brown@viima.com",
        profile_picture_url: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
    },
    {
        id: 5,
        fullname: "Administrator",
        email: "administrator@viima.com",
        profile_picture_url: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
    },
    {
        id: 6,
        fullname: "Simon Powell",
        email: "simon.powell@viima.com",
        profile_picture_url: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
    },
    {
        id: 7,
        fullname: "Bryan Connery",
        email: "bryan.connery@viima.com",
        profile_picture_url: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
    }
];