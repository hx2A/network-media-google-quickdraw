import os
import pandas as pd

ISO_CODES_URL = 'https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2'
DATA_DIR = '/local/DATA/itp/networked_media/google_quickdraw'

dfs = pd.read_html(ISO_CODES_URL, header=0, keep_default_na=False)

iso_codes = dfs[2].set_index('Code')['Country name']

with open(os.path.join(DATA_DIR, 'lookups', 'iso_codes.json'), 'w') as f:
    f.write(iso_codes.to_json())
