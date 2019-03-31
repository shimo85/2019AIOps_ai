import os
import os.path as pth
import pandas as pd
import numpy as np
from conf import *


def cal_dev_rate(pre, val):
    return np.float32((val - pre) / np.float64(pre))


def detect_t_value(in_file_pth=pth.join('rundata', 't_value_output'), max_dev_rate=.2,
                   is_output=True):
    print 'max dev rate: {}'.format(max_dev_rate)
    in_file = pth.join(in_file_pth, 't_values_with_pre.csv')
    df = pd.read_csv(in_file, encoding='utf-8')
    df['dev_r'] = df.apply(lambda i: cal_dev_rate(i['prediction'], i['t_value']), axis=1)
    df['label'] = df.apply(lambda i: 1 if np.abs(i['dev_r']) > max_dev_rate else 0, axis=1)
    # print df.head(100)
    print 'count: {}'.format(df['label'].count())
    print 'sum: {}'.format(df['label'].sum())
    print 'rate: {}'.format(np.float32(df['label'].sum() / np.float64(df['label'].count())))
    if is_output:
        df.to_csv(pth.join(in_file_pth, 't_values_with_pre_dev_lable.csv'), index=0)
        # TODO
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


def get_l1_abnormal_set(item_min_dev_r=.5):
    print 'item min dev rate: {}'.format(item_min_dev_r)
    '''
    output csv format:
    timestamp, attri_1_abnrm_items, attri_1_abnrm_items_count, attri_2_abnrm_items, ...
    1535891100000, i54#i46#i43#i24#i14#i11#i13#i12, 8, ...
    '''
    reslt_df = pd.DataFrame()

    t_values_with_pre_dev_lable_df = pd.read_csv(
        pth.join('rundata', 't_value_output', 't_values_with_pre_dev_lable.csv'), index_col='timestamp')

    abnrm_df = pd.read_csv(pth.join('rundata', 'abnormal_timestamp.csv'))
    abnrm_ts = abnrm_df['timestamp'].values

    model_df = pd.read_csv(pth.join('rundata', 'check_view_model.csv'), index_col='attri')

    f_path = pth.join('rundata', 'l1_value_output')

    df_map = {}
    for attri in ORIGIN_ATTRIS:
        df_map[attri] = pd.read_csv(
            pth.join(f_path, '{}_values_with_pre_dev.csv'.format(attri))
            , index_col='timestamp').loc[abnrm_ts][:]

    for ab_ts in abnrm_ts:
        print 'handle ts: {}'.format(ab_ts)
        reslt_dict = dict()
        reslt_dict['timestamp'] = ab_ts

        t_value_dev = t_values_with_pre_dev_lable_df.loc[ab_ts]['dev_r']
        # print 't_value_dev: {}'.format(t_value_dev)
        reslt_dict['t_value_dev'] = t_value_dev
        item_min_dev = t_value_dev * item_min_dev_r
        # print 'item_min_dev: {}'.format(item_min_dev)
        reslt_dict['item_min_dev'] = item_min_dev
        is_dev_positive = t_value_dev > 0
        for attri in ORIGIN_ATTRIS:
            # print 'handle attri: {}'.format(attri)
            df = df_map[attri]

            item_names = model_df.loc[attri]['item_set'].split('#')
            # print 'item size: {}'.format(len(item_names))
            dev_names = ['{}_dev_r'.format(i) for i in item_names]

            df = df.loc[ab_ts][dev_names]
            ser = df.T

            ser = ser.dropna()
            # print ser.head()
            # print 'item size after drop na: {}'.format(ser.count())

            ser = ser[ser > item_min_dev] if is_dev_positive else ser[ser < item_min_dev]
            # print ser.head()
            # print 'item size after drop min dev: {}'.format(ser.count())

            # print 'get abnrm items: {}'.format('#'.join(i[:-6] for i in ser.index))

            reslt_dict['{}_abnrm_items'.format(attri)] = '#'.join(i[:-6] for i in ser.index)
            reslt_dict['{}_abnrm_items_count'.format(attri)] = ser.count()

            # break
        reslt_df = reslt_df.append(reslt_dict, ignore_index=True)
        # break
    # print reslt_df.head()
    reslt_df.sort_values(by='timestamp').to_csv(pth.join('rundata', 'l1_abnormal.csv'), index=0)
    pass


def cal_l1_potential_score(t_value_pre_pth, l1_value_pre_pth, l1_abnml_f_pth, out_pth):
    if not pth.exists(out_pth):
        os.mkdir(out_pth)
    t_df = pd.read_csv(t_value_pre_pth, index_col='timestamp')
    # t_df.index = pd.to_datetime(t_df.index)

    l1_abnml_df = pd.read_csv(l1_abnml_f_pth, index_col='timestamp')
    # l1_abnml_df.index = pd.to_datetime(l1_abnml_df.index)

    for attri in ORIGIN_ATTRIS:
        l1_df = pd.read_csv(pth.join(l1_value_pre_pth, '{}_values_with_pre.csv'.format(attri)), index_col='timestamp')
        # l1_df.index = pd.to_datetime(l1_df.index)

        df = pd.DataFrame(index=t_df.index)

        items = list()

        for col in l1_df.columns:
            if col.endswith('_pre_dev'):
                items.append(col[:-8])

        for item in items:
            df[item] = l1_df['{}_pre_dev'.format(item)] / t_df['t_value_pre_dev']

        df.to_csv(pth.join(out_pth, '{}_potential_score.csv'.format(attri)))
    pass


if __name__ == '__main__':
    # for r in range(1, 20):
    #     detect_t_value(max_dev_rate=(r / 10.), is_output=False)
    # detect_t_value(max_dev_rate=.9, is_output=True)

    detect_l1_value()
    # get_l1_abnormal_set()
    pass
