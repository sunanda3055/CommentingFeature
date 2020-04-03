fileArray = [
    {
        "userFileName": "File1.txt",
        "textareaRows": 1,
        "comments": [
            {
                "id": 1,
                "parent": null,
                "created": "2015-01-01",
                "modified": "2015-01-01",
                "content": "Test 3",
                "creator": 6,
                "resolved": false,
                "fullname": "Simon Powell",
                "created_by_admin": false,
                "created_by_current_user": false,
                "childs": [
                    {
                        "id": 11,
                        "parent": 1,
                        "created": "2015-01-04",
                        "modified": "2015-01-04",
                        "content": "ISSUE: Include the survey details.",
                        "creator": 4,
                        "fullname": "Bryan Connery",
                        "created_by_admin": false,
                        "created_by_current_user": false,
                        "childs": []
                    },
                    {
                        "id": 12,
                        "parent": 1,
                        "created": "2015-01-04",
                        "modified": "2015-01-04",
                        "content": "What is the status of survey?",
                        "creator": 5,
                        "fullname": "Todd Brown",
                        "created_by_admin": false,
                        "created_by_current_user": false,
                        "childs": []
                    },
                    {
                        "id": 13,
                        "parent": 1,
                        "created": "2015-01-04",
                        "modified": "2015-01-04",
                        "content": "It is delayed.",
                        "creator": 5,
                        "fullname": "Jack Hemsworth",
                        "created_by_admin": false,
                        "created_by_current_user": false,
                        "childs": []
                    }
                ]
            },
            {
                "id": 2,
                "parent": null,
                "created": "2015-01-02",
                "modified": "2015-01-02",
                "content": "Test 2",
                "creator": 5,
                "resolved": false,
                "fullname": "Administrator",
                "created_by_admin": true,
                "created_by_current_user": false,
                "childs": []
            },
            {
                "id": 3,
                "parent": null,
                "created": "2015-01-03",
                "modified": "2015-01-03",
                "content": "Test 1",
                "creator": 1,
                "resolved": false,
                "fullname": "You",
                "created_by_admin": false,
                "created_by_current_user": true,
                "childs": [
                    {
                        "id": 4,
                        "parent": 3,
                        "created": "2015-01-04",
                        "modified": "2015-01-04",
                        "content": "ISSUE: Include the survey details.",
                        "creator": 4,
                        "fullname": "Todd Brown",
                        "created_by_admin": false,
                        "created_by_current_user": false,
                        "childs": []
                    },
                    {
                        "id": 5,
                        "parent": 3,
                        "created": "2020-01-05",
                        "modified": "2020-01-05",
                        "content": "Survey details are due with the surveyer.",
                        "creator": 3,
                        "fullname": "Hank Smith",
                        "created_by_admin": false,
                        "created_by_current_user": false,
                        "childs": []
                    }
                ]

            }
        ]
    },
    {
        "userFileName": "File2.txt",
        "textareaRows": 1,
        "comments": [
            {
                "id": 1,
                "parent": null,
                "created": "2015-01-01",
                "modified": "2015-01-01",
                "content": "Test 3",
                "creator": 6,
                "resolved": false,
                "fullname": "Simon Powell",
                "created_by_admin": false,
                "created_by_current_user": false,
                "childs": [
                    {
                        "id": "c1",
                        "parent": 1,
                        "created": "2015-01-04",
                        "modified": "2015-01-04",
                        "content": "ISSUE: Include the survey details.",
                        "creator": 4,
                        "fullname": "Bryan Connery",
                        "created_by_admin": false,
                        "created_by_current_user": false,
                        "childs": []
                    },
                    {
                        "id": "c2",
                        "parent": 1,
                        "created": "2015-01-04",
                        "modified": "2015-01-04",
                        "content": "What is the status of survey?",
                        "creator": 5,
                        "fullname": "Todd Brown",
                        "created_by_admin": false,
                        "created_by_current_user": false,
                        "childs": []
                    },
                    {
                        "id": "c3",
                        "parent": 1,
                        "created": "2015-01-04",
                        "modified": "2015-01-04",
                        "content": "It is delayed.",
                        "creator": 5,
                        "fullname": "Jack Hemsworth",
                        "created_by_admin": false,
                        "created_by_current_user": false,
                        "childs": []
                    }
                ]
            },
            {
                "id": 2,
                "parent": null,
                "created": "2015-01-02",
                "modified": "2015-01-02",
                "content": "Test 2",
                "creator": 5,
                "resolved": false,
                "fullname": "Administrator",
                "created_by_admin": true,
                "created_by_current_user": false,
                "childs": []
            },
            {
                "id": 3,
                "parent": null,
                "created": "2015-01-03",
                "modified": "2015-01-03",
                "content": "Test 1",
                "creator": 1,
                "resolved": false,
                "fullname": "You",
                "created_by_admin": false,
                "created_by_current_user": true,
                "childs": [
                    {
                        "id": 4,
                        "parent": 3,
                        "created": "2015-01-04",
                        "modified": "2015-01-04",
                        "content": "ISSUE: Include the survey details.",
                        "creator": 4,
                        "fullname": "Todd Brown",
                        "created_by_admin": false,
                        "created_by_current_user": false,
                        "childs": []
                    },
                    {
                        "id": 5,
                        "parent": 3,
                        "created": "2020-01-05",
                        "modified": "2020-01-05",
                        "content": "Survey details are due with the surveyer.",
                        "creator": 3,
                        "fullname": "Hank Smith",
                        "created_by_admin": false,
                        "created_by_current_user": false,
                        "childs": []
                    }
                ]

            }
        ]
    }
];

var usersArray = [
    {
        id: 1,
        fullname: "Current User",
        email: "current.user@viima.com",
    },
    {
        id: 2,
        fullname: "Jack Hemsworth",
        email: "jack.hemsworth@viima.com",
    },
    {
        id: 3,
        fullname: "Hank Smith",
        email: "hank.smith@viima.com",
    },
    {
        id: 4,
        fullname: "Todd Brown",
        email: "todd.brown@viima.com",
    },
    {
        id: 5,
        fullname: "Administrator",
        email: "administrator@viima.com",
    },
    {
        id: 6,
        fullname: "Simon Powell",
        email: "simon.powell@viima.com",
    },
    {
        id: 7,
        fullname: "Bryan Connery",
        email: "bryan.connery@viima.com",
    }
];