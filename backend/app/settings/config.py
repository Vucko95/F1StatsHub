import os
run_mode = os.environ.get('RUN_MODE', 'local')
if run_mode == 'local':
    DB_URL = 'mysql+pymysql://root:123@localhost:3306/f1db'
else:
    DB_URL = 'mysql+pymysql://root:123@mysql:3306/f1db'

f1_base_url  = 'https://ergast.com/api/f1/'
f1_base_url_plus_drivers_2023  = 'https://ergast.com/api/f1/2023/drivers.json'

frontend = 'http://localhost:5173'

