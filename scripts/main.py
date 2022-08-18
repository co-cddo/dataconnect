import os
import re

import requests


def get_lists_on_board():
    params = {
        'key': os.environ['API_KEY'],
        'token': os.environ['API_TOKEN'],
    }
    r = requests.get('https://api.trello.com/1/boards/627baf325445ee61e602441f/lists', params=params)
    return r.json()


def filter_lists(lists):
    filtered_list = []
    week_days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    for trello_list in lists:
        params = {
            'key': os.environ['API_KEY'],
            'token': os.environ['API_TOKEN'],
        }
        r = requests.get('https://api.trello.com/1/lists/' + trello_list['id'], params=params)
        response = r.json()
        if any(word in response['name'] for word in week_days):
            filtered_list.append(trello_list)
    return filtered_list


def get_cards(trello_list):
    params = {
        'key': os.environ['API_KEY'],
        'token': os.environ['API_TOKEN'],
    }
    r = requests.get('https://api.trello.com/1/lists/' + trello_list['id'] + '/cards', params=params)
    return r.json()


def filter_green_cards(cards):
    filtered_cards = []
    for card in cards:
        if card['cover']['color'] == 'green':
            filtered_cards.append(card)
    return filtered_cards


def write_to_file(weekday_lists):
    for weekday_list in weekday_lists:
        file = open('app/views/dc22/' + weekday_list['name'].split(' ', 1)[0] + '-events.html', 'w')
        file.write('<p><h2>' + weekday_list['name'].split(' ', 1)[0] + '</h2></p>')
        summary_file = open('app/views/dc22/' + weekday_list['name'].split(' ', 1)[0] + '-summary-events.html', 'w')
        summary_file.write('<p><h2>' + weekday_list['name'].split(' ', 1)[0] + '</h2></p>')
        cards = get_cards(weekday_list)
        filtered_cards = filter_green_cards(cards)
        for card in filtered_cards:
            description = format_signup_link(card['desc'])
            file.write('<h2>' + card['name'] + '</h2><p>' + description + '</p>')
            summary_file.write('<p>' + card['name'] + '</p><br>')
            if 'https://www.eventbrite.co' in description:
                file.write(get_code_to_embed_eventbrite(get_eventbrite_id(description)))


def get_code_to_embed_eventbrite(event_id):
    return "<div id=\"eventbrite-widget-container-" + event_id + "\"></div> " \
           "<script src=\"https://www.eventbrite.co.uk/static/widgets/eb_widgets.js\"></script>" \
           "<script type=\"text/javascript\">" \
           "var exampleCallback = function() {" \
           "console.log('Order complete!');" \
           "};" \
           "window.EBWidgets.createWidget({" \
           "widgetType: 'checkout'," \
           "eventId: '" + event_id + "'," \
           "iframeContainerId: 'eventbrite-widget-container-" + event_id +"'," \
           "});" \
           "</script>"


def format_signup_link(description):
    description = description.replace('\n', '')
    if 'https://www.eventbrite.co.uk' in description:
        result = re.search('https://www.eventbrite.co.uk(.*)</p>', description)
        url = 'https://www.eventbrite.co.uk' + result.group(1)
        description = description.replace(result.group(0), '<a href="' + url + '">Eventbrite page</a></p>')
    elif 'https://www.eventbrite.com' in description:
        result = re.search('https://www.eventbrite.com(.*)</p>', description)
        url = 'https://www.eventbrite.com' + result.group(1)
        description = description.replace(result.group(0), '<a href="' + url + '">Eventbrite page</a></p>')
    return description


def get_eventbrite_id(description):
    result = ''
    if 'https://www.eventbrite.co.uk' in description:
        result = re.search('https://www.eventbrite.co.uk(.*)">Eventbrite page</a></p>', description)
    elif 'https://www.eventbrite.com' in description:
        result = re.search('https://www.eventbrite.com(.*)">Eventbrite page</a></p>', description)
    result = result.group(1).rpartition('-')[-1]
    result = result.replace('/e/', '')
    result = result.replace('/', '')
    return result


if __name__ == '__main__':
    all_lists = get_lists_on_board()
    weekday_lists = filter_lists(all_lists)
    write_to_file(weekday_lists)
