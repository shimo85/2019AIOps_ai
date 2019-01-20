import os
import os.path as pth
import pandas as pd
import my_util as utl
from conf import *

print 'attributes: {}'.format(str(ORIGIN_ATTRIS))
print 'columns: {}'.format(str(ORIGIN_COLUMN))


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
    f_pth = pth.join('rundata', 'check_view.csv')
    df = pd.read_csv(f_pth)
    for attri in ORIGIN_ATTRIS:
        print '{0:-^20}'.format(attri)
        attri_count_temp = '{}_item_count'.format(attri)
        print 'max: {}'.format(df[attri_count_temp].max())
        print 'min: {}'.format(df[attri_count_temp].min())
        print 'mean: {}'.format(df[attri_count_temp].mean())
        item_set = set()
        for items in df['{}_items'.format(attri)]:
            for item in items.split('#'):
                item_set.add(item)
        print 'item count: {}'.format(len(item_set))
    pass


def col_total_values(origin_data):
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
    t_df.to_csv(pth.join('rundata', 't_value_output', 't_values.csv'), columns=['timestamp', 't_value'], index=0)


if __name__ == '__main__':
    origin_f_path = pth.join('rundata', '2019AIOps_data')
    print 'read origin data from ', origin_f_path
    # features_out = transfer_features(origin_f_path)
    # print 'transfer features to ', features_out
    # col_total_values(origin_f_path)
    # check_features(origin_f_path)
    # draw_check_view()
    desc_check_view()

    pass
