import requests
import csv
import os.path
import json
import time

# Done
# Doing
# To do Wiltshire E06000054 Devon E07000041 Plymouth E06000026

DATA_SOURCE_OAS = '../data/oa_centroids/oa_centroids_lad11cd_E06000026.shp.csv'
DATA_SOURCE_LIBS = '../data/libraries/libraries.csv'
OUTPUT_DIR = '../data/oa_distances/'
ORS_KEY = '58d904a497c67e00015b45fc42337203b9d0468561ab2f37e26ecb76'
MB_TOKEN = 'pk.eyJ1IjoiZHhyb3dlIiwiYSI6ImNqOTBlOWF3cjJidDEyeG43MDBmNDBxaGwifQ.gduXtiwaIi4xLdZpHCzVHA'
MAPQUEST = '0kYuW0J0ggz5GEFEFKdwtl1ZrpPE0OYg'


def run():
    oas = []
    with open(DATA_SOURCE_OAS, 'r') as oa_file:
        oareader = csv.reader(oa_file, delimiter=',', quotechar='"')
        next(oareader, None)  # skip the headers
        # X,Y,oa11cd,lad11cd
        for row in oareader:
            oas.append({'lng': row[0], 'lat': row[1],
                        'oa': row[2], 'district': row[3]})

    libraries = []
    with open(DATA_SOURCE_LIBS, 'r') as libs:
        libreader = csv.reader(libs, delimiter=',', quotechar='"')
        next(libreader, None)  # skip the headers
        # Library,Lat,Long
        for row in libreader:
            libraries.append({'lng': row[6], 'lat': row[5], 'library': row[0]})

    for oa in oas:

        # ORS Matrix: "https://api.openrouteservice.org/matrix?profile=driving-car&locations=-3.18801%2C51.0611|-3.00104%2C51.1284|-2.53941925610321%2C51.220653952736|-2.52000773343246%2C51.2349068904321&sources=0&destinations=1,2,3&metrics=distance|duration|weight&api_key=58d904a497c67e00015b45fc42337203b9d0468561ab2f37e26ecb76'
        # Mapquest Matrix: http://open.mapquestapi.com/directions/v2/routematrix?key=KEY

        # For each OA loop through all the libraries, create a file per OA

        locations = oa['lng'] + '%2C' + oa['lat']
        destinations = []
        for (idx, library) in enumerate(libraries):
            locations = locations + '|' + \
                library['lng'] + '%2C' + library['lat']
            destinations.append(str(idx + 1))

        transport = ['driving-car', 'driving-hgv', 'cycling-regular', 'cycling-road', 'cycling-safe',
                     'cycling-mountain', 'cycling-tour', 'cycling-electric', 'foot-walking', 'foot-hiking', 'wheelchair']

        for tran in transport:
            # Cycling
            if not os.path.isfile(OUTPUT_DIR + oa['oa'] + '_' + tran + '.json'):
                oa_data = []
                url = (
                    'https://api.openrouteservice.org/matrix?profile=' + tran + '&locations=' +
                    locations + '&sources=0&destinations=' + (','.join(destinations)) +
                    '&metrics=distance|duration|weight&api_key=' + ORS_KEY)
                data = requests.get(url)
                data = json.loads(data.text)
                if not 'error' in data:
                    for (idx, library) in enumerate(libraries):
                        oa_data.append(
                            {'library': library['library'], 'distance': data['distances'][0][idx],
                                'duration': data['durations'][0][idx], 'weight': data['weights'][0][idx]}
                        )

                    with open(OUTPUT_DIR + oa['oa'] + '_' + tran + '.json', 'w') as outfile:
                        json.dump(oa_data, outfile)
                else:
                    if data['error']['code'] == 6099:
                        with open(OUTPUT_DIR + oa['oa'] + '_' + tran + '.json', 'w') as outfile:
                            json.dump(
                                {'error': data['error']['message']}, outfile)

                time.sleep(5)


run()
