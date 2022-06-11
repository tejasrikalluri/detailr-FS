## Detailr

# Overview
Detailr lets you access requesters' details on the Freshservice's portal.

# Description
1. With Detailr, admins can configure additional requester fields (default fields, custom fields, and all additional details available for the contact) which agents want to view on the Ticket Details, Contact Details, and New Ticket pages.
2. The app eliminates the need for agents to switch between the Ticket Details and Contact Details page to view all the requester details.
3. Consequently, it improves agents’ productivity.

# Instructions
1. To install Detailr app in Freshservice, go to Admin > Apps > Get more Apps. Locate ‘Detailr’ in the app gallery and click Install.
2. Enter your Freshservice domain name and API key.
3. Select the required Requester fields which you want to display in the app and click Install.
4. The Detailr app widget will now be visible on the Ticket details page, Contact Details page, and New Ticket page.
5. On the New Ticket page, the requester details are displayed after the requester's name is entered in the Requester field.

### Files and Folders
    .
    ├── README.md                     A file for your future self and developer friends to learn about app
    ├── app                           A folder to put all files needed for frontend components
    │   ├── index.html                A landing page for the user to use the app
    │   ├── scripts                   JavaScript to handle app's frontend components business logic
    │   │   └── app.js                JS business logic
            └── utils.js              Utility logic
    │   └── styles                    A folder of all the styles for app
    │       ├── images                A folder to put all the images
    │       │   ├── icon.svg
    │       │   └── rocket.svg
    │       └── style.css
    ├── config                        A folder to hold all the app's configuration files
    │   └── iparams.html              A landing page settings page
    └── manifest.json                 A JSON file holding meta data for app to run on platform

Explore [more of app sample apps](https://community.developers.freshworks.com/t/freshworks-sample-apps/3604) on the Freshworks github respository.

Note: In this version added custom selected custom fields in settings page.
