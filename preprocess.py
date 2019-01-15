import os
import os.path as pth
import pandas as pd
import my_util as utl


def transfer_features(origin_data):
    print 'start transfer features'
    for timestamp_f in os.listdir(origin_data):
        ts = utl.transfer_file_name_to_timestamp(timestamp_f)
        print ts
        df = pd.read_csv(pth.join(origin_data, timestamp_f), encoding='utf-8', header=None,
                         names=['attri_1', 'attri_2', 'attri_3', 'attri_4', 'attri_5', 'value'])
        print df.head()
        # print df.describe()
        # print df.dtypes

        print df.groupby(df['attri_1']).sum()

        break

    out_f_pth = pth.join('rundata', 'features_output')

    return out_f_pth


def col_total_values(origin_data):
    print 'start collect total values'
    data_map = {'timestamp': [], 't_value': []}
    for timestamp_f in os.listdir(origin_data):
        ts = utl.transfer_file_name_to_timestamp(timestamp_f)
        data_map['timestamp'].append(ts)
        df = pd.read_csv(pth.join(origin_data, timestamp_f), encoding='utf-8', header=None,
                         names=['attri_1', 'attri_2', 'attri_3', 'attri_4', 'attri_5', 'value'])
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
    col_total_values(origin_f_path)

    pass
