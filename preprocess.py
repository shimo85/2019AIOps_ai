import os
import os.path as pth
import pandas as pd


def transfer_features(origin_data):
    print 'start transfer features'
    for timestamp_f in os.listdir(origin_data):
        ts = timestamp_f[:-4]
        print ts
        df = pd.read_csv(pth.join(origin_data, timestamp_f), encoding='gbk', header=None,
                         names=['attri_1', 'attri_2', 'attri_3', 'attri_4', 'attri_5', 'value'])
        print df.head()
        # print df.describe()
        # print df.dtypes

        print df.groupby(df['attri_1']).sum()

        break

    out_f_pth = pth.join('rundata', 'features_output')

    return out_f_pth


if __name__ == '__main__':
    origin_f_path = pth.join('rundata', '2019AIOps_data')
    print 'read origin data from ', origin_f_path
    features_out = transfer_features(origin_f_path)
    print 'transfer features to ', features_out

    pass
