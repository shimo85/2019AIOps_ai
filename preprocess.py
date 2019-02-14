import os
import os.path as pth
import pandas as pd
import my_util as utl
from statsmodels.tsa.stattools import adfuller
from conf import *


def check_features(origin_data):
    print 'check features'
    '''
    output csv:

    timestamp, count, attri_1_items, attri_1_item_count, ...
    
    '''
    out_data = {'timestamp': [], 'count': []}

    for i in ORIGIN_ATTRIS:
        out_data['{}_items'.format(i)] = []
        out_data['{}_item_count'.format(i)] = []

    for timestamp_f in os.listdir(origin_data):
        ts = utl.transfer_file_name_to_timestamp(timestamp_f)
        # print ts
        out_data['timestamp'].append(ts)
        df = pd.read_csv(pth.join(origin_data, timestamp_f), encoding='utf-8', header=None, names=ORIGIN_COLUMN)

        out_data['count'].append(df['value'].count())

        for i in ORIGIN_ATTRIS:
            attri_temp = df[i].drop_duplicates()
            out_data['{}_items'.format(i)].append('#'.join(attri_temp))
            out_data['{}_item_count'.format(i)].append(attri_temp.count())

            # break

    out_f_pth = pth.join('rundata', 'check_view.csv')
    # print out_data
    # print out_data.keys()
    pd.DataFrame(out_data).sort_values(by='timestamp').to_csv(out_f_pth, index=None)
    # return out_f_pth


def draw_check_view():
    f_pth = pth.join('rundata', 'check_view.csv')
    df = pd.read_csv(f_pth)
    import matplotlib.pyplot as plt
    plt.figure()
    for i in ORIGIN_ATTRIS:
        plt.plot(df['timestamp'], df['{}_item_count'.format(i)], label=i)
    plt.legend()
    plt.show()
    pass


def desc_check_view():
    print 'description of attributes'
    '''
    csv format:
    attri, count_max, count_min, count_mean, item_set, item_set_count
    
    '''
    f_pth = pth.join('rundata', 'check_view.csv')
    df = pd.read_csv(f_pth)
    data_map = {'attri': [],
                'count_max': [], 'count_min': [], 'count_mean': [],
                'item_set': [], 'item_set_count': []
                }
    for attri in ORIGIN_ATTRIS:
        data_map['attri'].append(attri)
        # print '{0:-^20}'.format(attri)
        attri_count_temp = '{}_item_count'.format(attri)
        data_map['count_max'].append(df[attri_count_temp].max())
        # print 'max: {}'.format(df[attri_count_temp].max())
        data_map['count_min'].append(df[attri_count_temp].min())
        # print 'min: {}'.format(df[attri_count_temp].min())
        data_map['count_mean'].append(df[attri_count_temp].mean())
        # print 'mean: {}'.format(df[attri_count_temp].mean())
        item_set = set()
        for items in df['{}_items'.format(attri)]:
            for item in items.split('#'):
                item_set.add(item)
        data_map['item_set'].append('#'.join(item_set))
        data_map['item_set_count'].append(len(item_set))
        # print 'item count: {}'.format(len(item_set))
    pd.DataFrame(data_map).to_csv(pth.join('rundata', 'check_view_model.csv'), index=0)


def col_total_values(origin_data, output_pth=pth.join('rundata', 't_value_output')):
    print 'start collect total values'
    data_map = {'timestamp': [], 't_value': []}
    for timestamp_f in os.listdir(origin_data):
        ts = utl.transfer_file_name_to_timestamp(timestamp_f)
        data_map['timestamp'].append(ts)
        df = pd.read_csv(pth.join(origin_data, timestamp_f), encoding='utf-8', header=None, names=ORIGIN_COLUMN)
        data_map['t_value'].append(df['value'].sum())
    t_df = pd.DataFrame(data=data_map).sort_values(by='timestamp')
    # print t_df.head()
    # return ret_list
    t_value_f_pth = pth.join(output_pth, 't_values.csv')
    t_df.to_csv(t_value_f_pth, columns=['timestamp', 't_value'], index=0)


def col_l1_values(origin_data):
    print 'start collect level-1 data'
    '''
    output level-1 attribute values to csv
    
    directory contains n attributes csv file
    
    csv format:
    timestamp, attri_1_item_1_value, attri_1_item_2_value, ...
    
    '''
    out_pth = pth.join('rundata', 'l1_value_output')
    utl.reset_dir(out_pth)

    data_map = {}
    # attri_df = pd.read_csv(pth.join('rundata', 'check_view_model.csv'), index_col='attri')
    # print attri_df.head()
    for attri in ORIGIN_ATTRIS:
        # item_set = attri_df.loc[attri]['item_set']
        # data_map[attri] = pd.DataFrame(columns=item_set.split('#'))
        data_map[attri] = pd.DataFrame()

    for timestamp_f in os.listdir(origin_data):
        ts = utl.transfer_file_name_to_timestamp(timestamp_f)
        df = pd.read_csv(pth.join(origin_data, timestamp_f), encoding='utf-8', header=None, names=ORIGIN_COLUMN)

        for attri in ORIGIN_ATTRIS:
            df_gb = df.groupby(by=attri).agg({'value': sum})
            df_gb_dict = df_gb.to_dict()['value']
            df_gb_dict['timestamp'] = ts
            data_map[attri] = data_map[attri].append(df_gb_dict, ignore_index=True)

    for attri in ORIGIN_ATTRIS:
        data_map[attri] = data_map[attri].sort_values(by='timestamp')
        data_map[attri].to_csv(pth.join(out_pth, '{}_values.csv'.format(attri)), index=0)

    pass


def l1_adf_detector(origin_data):
    print 'detect adf from: {}'.format(origin_data)
    '''
    detect l1 values' adf, and output to adf_result.csv
    attri_item, adf, pvalue, critical_value_1, critical_value_5, critical_value_10, label
    '''
    ret_df = pd.DataFrame()
    for attri in ORIGIN_ATTRIS:
        df = pd.read_csv(pth.join(origin_data, '{}_values.csv'.format(attri)), index_col='timestamp')
        for item in df.columns:
            r_dict = dict()
            r_dict['attri_item'] = '{}_{}'.format(attri, item)
            try:
                _series = pd.Series(data=df[item].dropna())
                dta = _series.diff(1)[1:]
                adf, pvalue, _, _, c_v_dict, _ = adfuller(dta)
                r_dict['adf'] = adf
                r_dict['pvalue'] = pvalue
                r_dict['critical_value_1'] = c_v_dict['1%']
                r_dict['critical_value_5'] = c_v_dict['5%']
                r_dict['critical_value_10'] = c_v_dict['10%']
                r_dict['label'] = 1 if (adf < c_v_dict['1%'] and adf < c_v_dict['5%'] and adf < c_v_dict['10%']) else 0
            except Exception:
                r_dict['label'] = 0
            ret_df = ret_df.append(pd.Series(r_dict), ignore_index=True)
    print ret_df.head()
    ret_df.to_csv(pth.join(origin_data, 'adf_result.csv'), index=0)

    pass


if __name__ == '__main__':
    origin_f_path = pth.join('rundata', 'origin_data')
    print 'read origin data from ', origin_f_path

    col_total_values(origin_f_path)

    # check_features(origin_f_path)
    # draw_check_view()
    # desc_check_view()

    # col_l1_values(origin_f_path)

    # l1_adf_detector(pth.join('rundata', 'l1_value_output'))
