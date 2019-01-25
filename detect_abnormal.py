import os.path as pth
import pandas as pd
import numpy as np
from conf import *


def cal_dev_rate(pre, val):
    return np.float32(np.abs(pre - val) / np.float32(pre))


def detect_t_value(max_dev_rate=.15):
    in_file = pth.join('rundata', 't_value_output', 't_values_with_pre.csv')
    df = pd.read_csv(in_file, encoding='utf-8')
    df['dev_r'] = df.apply(lambda i: cal_dev_rate(i['prediction'], i['t_value']), axis=1)
    df['label'] = df.apply(lambda i: 1 if i['dev_r'] > max_dev_rate else 0, axis=1)
    # print df.head(100)
    print 'count: {}'.format(df['label'].count())
    print 'sum: {}'.format(df['label'].sum())
    df.to_csv(pth.join('rundata', 't_value_output', 't_values_with_pre_dev_lable.csv'), index=0)
    df.loc[df['label'] == 1, ['timestamp']].to_csv(pth.join('rundata', 'abnormal_timestamp.csv'), index=None)
    pass


def detect_l1_value():
    f_path = pth.join('rundata', 'l1_value_output')

    model_df = pd.read_csv(pth.join('rundata', 'check_view_model.csv'), index_col='attri')

    for attri in ORIGIN_ATTRIS:
        df = pd.read_csv(pth.join(f_path, '{}_values_with_pre.csv'.format(attri)), index_col='timestamp')
        for item in model_df.loc[attri]['item_set'].split('#'):
            pre_label = '{}_prediction'.format(item)
            value_label = item
            item_df = df[[pre_label, value_label]].dropna()
            df['{}_dev_r'.format(item)] = item_df.apply(lambda i: cal_dev_rate(i[pre_label], i[value_label]), axis=1)
        df.to_csv(pth.join(f_path, '{}_values_with_pre_dev.csv'.format(attri)))
    pass


if __name__ == '__main__':
    # detect_t_value()
    detect_l1_value()
