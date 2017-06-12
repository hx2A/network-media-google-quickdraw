import os
import pandas as pd

ISO_CODES_URL = 'https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2'
DATA_DIR = '/local/DATA/itp/networked_media/google_quickdraw'

dfs = pd.read_html(ISO_CODES_URL, header=0, keep_default_na=False)

iso_codes = dfs[2].set_index('Code')['Country name']

# shrink the size of the longer country names
iso_codes['AX'] = 'Aland Islands'
iso_codes['BA'] = 'Bosnia and Herzegovina'
iso_codes['BO'] = 'Bolivia'
iso_codes['BQ'] = 'Caribbean Netherlands'
iso_codes['CC'] = 'Cocos Islands'
iso_codes['CD'] = 'Democratic Republic of Congo'
iso_codes['CF'] = 'Central African Republic'
iso_codes['CI'] = 'Ivory Coast'
iso_codes['FK'] = 'Falkland Islands'
iso_codes['FM'] = 'Micronesia'
iso_codes['GB'] = 'United Kingdom'
iso_codes['GS'] = 'South Georgia'
iso_codes['HM'] = 'Heard Island and McDonald Islands'
iso_codes['IO'] = 'British Indian Ocean Territory'
iso_codes['IR'] = 'Iran'
iso_codes['KN'] = 'Saint Kitts and Nevis'
iso_codes['KP'] = 'North Korea'
iso_codes['KR'] = 'South Korea'
iso_codes['LA'] = 'Laos'
iso_codes['MD'] = 'Moldova'
iso_codes['MF'] = 'Saint Martin (French part)'
iso_codes['MK'] = 'Macedonia'
iso_codes['MP'] = 'Northern Mariana Islands'
iso_codes['PM'] = 'Saint Pierre and Miquelon'
iso_codes['PS'] = 'Palestine'
iso_codes['RE'] = 'Reunion'
iso_codes['SH'] = 'Saint Helena, Ascension and Tristan da Cunha'
iso_codes['SJ'] = 'Svalbard and Jan Mayen'
iso_codes['ST'] = 'Sao Tome and Principe'
iso_codes['SX'] = 'Sint Maarten (Dutch part)'
iso_codes['TC'] = 'Turks and Caicos Islands'
iso_codes['TF'] = 'French Southern Territories'
iso_codes['TW'] = 'Taiwan'
iso_codes['TZ'] = 'Tanzania'
iso_codes['UM'] = 'United States Minor Outlying Islands'
iso_codes['VC'] = 'Saint Vincent'
iso_codes['VE'] = 'Venezuela'
iso_codes['VG'] = 'British Virgin Islands'
iso_codes['VI'] = 'US Virgin Islands'
iso_codes['VN'] = 'Vietnam'

# make all the codes lowercase
iso_codes.index = iso_codes.index.str.lower()

with open(os.path.join(DATA_DIR, 'lookups', 'iso_codes.json'), 'w') as f:
    f.write(iso_codes.to_json())
