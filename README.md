# DataConnect

The website for DataConnect - https://dataconnect.api.gov.uk

## Updating the content
There is [a script](/scripts/main.py) which automatically updates the content when someone updates [the Trello board](https://trello.com/b/jdeZn4Md/dataconnect-22-sessions).

There is a Github action that runs once an hour in working hours to check for updates.

## Hosting
The app is hosted on Heroku.

## Running locally
To run the site locally you will need Node installed. You'll need to:
- Run `npm install`
- Run `npm start`

Note that if you're running this on an M1 mac you will need Node 14 or lower.

To run the script that updates the content locally, you will need Python 3 installed. You'll need to:
- Run `pip install -r scripts/requirements.txt`
- Run `python scripts/main.py`
