var commentsArray = [
    {
        "id": 1,
        "parent": null,
        "created": "2015-01-01",
        "modified": "2015-01-01",
        "content": "Test 3",
        "creator": 6,
        "fullname": "Simon Powell",
        "profile_picture_url": "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png",
        "created_by_admin": false,
        "created_by_current_user": false,
        "is_new": false
    },
    {
        "id": 2,
        "parent": null,
        "created": "2015-01-02",
        "modified": "2015-01-02",
        "content": "Test 2",
        "creator": 5,
        "fullname": "Administrator",
        "profile_picture_url": "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png",
        "created_by_admin": true,
        "created_by_current_user": false,
        "is_new": false
    },
    {
        "id": 3,
        "parent": null,
        "created": "2015-01-03",
        "modified": "2015-01-03",
        "content": "Test 1",
        "creator": 1,
        "fullname": "You",
        "profile_picture_url": "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png",
        "created_by_admin": false,
        "created_by_current_user": true,
        "is_new": false
    },
    {
        "id": 4,
        "parent": 3,
        "created": "2015-01-04",
        "modified": "2015-01-04",
        "content": "ISSUE: Include the survey details.",
        // "file_url": "http://www.w3schools.com/html/mov_bbb.mp4",
        // "file_mime_type": "video/mp4",
        "creator": 4,
        "fullname": "Todd Brown",
        "profile_picture_url": "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png",
        "created_by_admin": false,
        "created_by_current_user": false,
        "is_new": true
    },
    {
        "id": 5,
        "parent": 4,
        "created": "2020-01-05",
        "modified": "2020-01-05",
        "content": "Survey details are due with the surveyer.",
        "creator": 3,
        "fullname": "Hank Smith",
        "profile_picture_url": "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png",
        "created_by_admin": false,
        "created_by_current_user": false,
        "is_new": true
    },
    {
        "id": 6,
        "parent": 1,
        "created": "2020-01-06",
        "modified": "2020-01-06",
        "content": "ISSUE: Delay in production..",
        "creator": 2,
        "fullname": "Jack Hemsworth",
        "profile_picture_url": "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png",
        "created_by_admin": false,
        "created_by_current_user": false,
        "is_new": false
    },
    {
        "id": 7,
        "parent": 1,
        "created": "2020-01-07",
        "modified": "2020-01-07",
        "content": "Once all the tickets are closed, then we will move tickets.",
        "creator": 5,
        "fullname": "Administrator",
        "profile_picture_url": "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png",
        "created_by_admin": true,
        "created_by_current_user": false,
        "is_new": false
    },
    {
        "id": 8,
        "parent": 6,
        "created": "2020-01-08",
        "modified": "2020-01-08",
        "content": "We haven't verified by QA that it is completed at their end or not.",
        "creator": 1,
        "fullname": "You",
        "profile_picture_url": "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png",
        "created_by_admin": false,
        "created_by_current_user": true,
        "is_new": false
    },
    {
        "id": 9,
        "parent": 8,
        "created": "2020-01-09",
        "modified": "2020-01-10",
        "content": "QA require its time to accomplish the task.",
        "creator": 7,
        "fullname": "Bryan Connery",
        "profile_picture_url": "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png",
        "created_by_admin": false,
        "created_by_current_user": false,
        "is_new": false
    },
    {
        "id": 10,
        "parent": 9,
        "created": "2020-01-10",
        "modified": "2020-01-10",
        "content": "It is completed from my side.",
        "creator": 1,
        "fullname": "You",
        "profile_picture_url": "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png",
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
        profile_picture_url: "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png"
    },
    {
        id: 2,
        fullname: "Jack Hemsworth",
        email: "jack.hemsworth@viima.com",
        profile_picture_url: "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png"
    },
    {
        id: 3,
        fullname: "Hank Smith",
        email: "hank.smith@viima.com",
        profile_picture_url: "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png"
    },
    {
        id: 4,
        fullname: "Todd Brown",
        email: "todd.brown@viima.com",
        profile_picture_url: "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png"
    },
    {
        id: 5,
        fullname: "Administrator",
        email: "administrator@viima.com",
        profile_picture_url: "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png"
    },
    {
        id: 6,
        fullname: "Simon Powell",
        email: "simon.powell@viima.com",
        profile_picture_url: "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png"
    },
    {
        id: 7,
        fullname: "Bryan Connery",
        email: "bryan.connery@viima.com",
        profile_picture_url: "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png"
    }
];

var fileArray = [
    {
        "userFileName": "File1.txt",
        "profilePictureURL": "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png",
        "currentUserId": 1,
        "roundProfilePictures": true,
        "textareaRows": 1
    },
    {
        "userFileName": "File2.txt",
        "profilePictureURL": "https://ssl.gstatic.com/s2/profiles/images/silhouette96.png",
        "currentUserId": 2,
        "roundProfilePictures": true,
        "textareaRows": 1
    }
];