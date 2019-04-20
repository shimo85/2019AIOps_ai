import os
import os.path as pth
import pandas as pd
import my_util as utl
from conf import *

if __name__ == '__main__':
    origin_pth = pth.join('rundata', 'origin_data')
    test_pth = pth.join('rundata', 'test1_data')
    temp_pth = pth.join('rundata', 'temp')

    df = pd.DataFrame()

    for data_pth in (origin_pth, test_pth):
        for ts_f in os.listdir(data_pth):
            ts = utl.transfer_file_name_to_timestamp(ts_f)
            ts_df = pd.read_csv(pth.join(data_pth, ts_f), header=None, names=ORIGIN_COLUMN, index_col=ORIGIN_ATTRIS)
            df[ts] = ts_df['value']

    print df.head()

    pass
