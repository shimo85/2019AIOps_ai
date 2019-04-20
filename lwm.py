import os
import os.path as pth
import pandas as pd
import my_util as utl
from conf import *


def read_data(*args):
    df = pd.DataFrame()

    # head = 0

    for data_pth in args:
        print 'read data from: {}'.format(data_pth)
        for ts_f in os.listdir(data_pth):
            # head += 1
            # if head > 100:
            #     break
            ts = utl.transfer_file_name_to_timestamp(ts_f)
            print 'ts: {}'.format(ts)
            ts_df = pd.read_csv(pth.join(data_pth, ts_f), header=None, names=ORIGIN_COLUMN, index_col=ORIGIN_ATTRIS)
            df[ts] = ts_df['value']
            # df = df.append(ts_df)

    df.fillna(0.0, inplace=True)
    # return df.T
    return df


def read_time_df(*args):
    # ts_f_pth_list = list()
    ts_list = list()
    for data_pth in args:
        print 'read data from: {}'.format(data_pth)
        for ts_f in os.listdir(data_pth):
            # ts_f_pth_list.append(pth.join(data_pth,ts_f))
            ts = utl.transfer_file_name_to_timestamp(ts_f)
            ts_list.append(int(ts))
    return pd.DataFrame(pd.Series(ts_list, name='timestamp'))


if __name__ == '__main__':
    origin_pth = pth.join('rundata', 'origin_data')
    test_pth = pth.join('rundata', 'test2_data')

    abnrm_pth = pth.join('rundata', 'Anomalytime_data_test2.csv')
    temp_pth = pth.join('rundata', 'temp')

    # df = read_data(origin_pth, test_pth)
    # df = read_data(origin_pth)
    # df = read_data(test_pth)
    # df.sort_index(inplace=True)
    # print df.head()

    ts_df = read_time_df(origin_pth, test_pth)
    ts_df['last_timestamp'] = ts_df.apply(lambda r: r['timestamp'] - 5 * 60 * 1000, axis=1)
    ts_df['datetime'] = pd.to_datetime(ts_df['timestamp'], unit='ms')
    # ts_df = ts_df.set_index('datetime')
    ts_df['hour'] = ts_df['datetime'].dt.hour
    ts_df['minute'] = ts_df['datetime'].dt.minute

    ts_df.sort_values('timestamp', inplace=True)
    ts_df.set_index('timestamp', inplace=True)
    ts_df['label'] = 0
    ab_df = pd.read_csv(abnrm_pth)
    ab_df['label'] = 1
    ab_df.set_index('timestamp', inplace=True)
    ts_df['label'].update(ab_df['label'])

    # print ts_df.head()
    abnrm_tss = ts_df[ts_df['label'] > 0]
    # print abnrm_tss.head()
    abnrm_tss['hm'] = abnrm_tss.apply(lambda r: '{}:{}'.format(r['hour'], r['minute']), axis=1)
    # abnrm_tss['hm'] = abnrm_tss['{}-{}'.format(abnrm_tss['hour'], abnrm_tss['minute'])]
    print abnrm_tss['hm'].head()

    pass
