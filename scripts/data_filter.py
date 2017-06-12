import os
import glob
import json

import numpy as np
import pandas as pd

DATA_DIR = '/local/DATA/itp/networked_media/google_quickdraw'
SIZE_LIMIT = 25
FILE_LIMIT = 100

with open(os.path.join(DATA_DIR, 'lookups', 'iso_codes.json'), 'r') as f:
    iso_codes = json.load(f)

files = glob.glob(os.path.join(DATA_DIR, 'clean', '*.p'))
if FILE_LIMIT:
    files = sorted(np.random.choice(files, size=FILE_LIMIT, replace=False))
else:
    files = sorted(files)

all_data = []

for i, filename in enumerate(files):
    print("{0}/{1}: {2}".format(files.index(filename) + 1,
                                len(files), filename))

    rs = np.random.RandomState(i)
    data = pd.read_pickle(filename)

    def data_filtering(df):
        if df.shape[0] <= SIZE_LIMIT:
            return df
        else:
            return df.sample(n=SIZE_LIMIT, replace=False, random_state=rs)

    all_data.append(
        data.groupby('c').apply(data_filtering).reset_index(drop=True))

data_filtered = pd.concat(all_data).reset_index()

# make the country codes all lowercase
data_filtered['c'] = data_filtered['c'].str.lower()
# discard countries we have no iso code for
data_filtered = data_filtered[data_filtered['c'].isin(iso_codes.keys())]

data_file = 'data_{0}_{1}.p'.format(SIZE_LIMIT, FILE_LIMIT)
data_filtered.to_pickle(os.path.join(DATA_DIR, 'filtered', data_file))


def remove_index(r):
    del r['index']
    return r
records = [remove_index(r) for r in data_filtered.to_dict(orient='records')]

json_file = 'data_{0}_{1}.json'.format(SIZE_LIMIT, FILE_LIMIT)
with open(os.path.join(DATA_DIR, 'filtered', json_file), 'w') as f:
    json.dump(records, f)
    print("Wrote {0} records".format(len(records)))

countries = data_filtered['c'].unique().tolist()
countries.sort(key=lambda cc: iso_codes[cc])

countries_file = 'countries_{0}_{1}.json'.format(SIZE_LIMIT, FILE_LIMIT)
with open(os.path.join(DATA_DIR, 'lookups', countries_file), 'w') as f:
    json.dump(countries, f)

categories = data_filtered['w'].unique().tolist()

categories_file = 'categories_{0}_{1}.json'.format(SIZE_LIMIT, FILE_LIMIT)
with open(os.path.join(DATA_DIR, 'lookups', categories_file), 'w') as f:
    json.dump(categories, f)


# mongoimport -h ds163681.mlab.com:63681 -d network-media -c google_sketches -u jim -p BExvuotBesesEp9 --jsonArray  --file data.json

# cp categories_25_25.json /mnt/itp_do/Projects/midterm/reference/categories.json
# cp countries_25_25.json /mnt/itp_do/Projects/midterm/reference/countries.json
