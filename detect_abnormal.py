import os.path as pth
import pandas as pd
import numpy as np

if __name__ == '__main__':
    in_file = pth.join('rundata', 't_value_output', 't_values_with_pre.csv')
    df = pd.read_csv(in_file, encoding='utf-8')
    df['dev_r'] = df.apply(lambda i: np.float32(np.abs(i['t_value'] - i['prediction']) / np.float32(i['prediction'])),
                           axis=1)
    max_dev_rate = .15
    df['label'] = df.apply(lambda i: 1 if i['dev_r'] > max_dev_rate else 0, axis=1)
    # print df.head(100)
    print 'count: {}'.format(df['label'].count())
    print 'sum: {}'.format(df['label'].sum())

    df.to_csv(pth.join('rundata', 't_value_output', 't_values_with_pre_dev_lable.csv'), index=0)

    df.loc[df['label'] == 1, ['timestamp']].to_csv(pth.join('rundata', 'abnormal_timestamp.csv'), index=None)

    pass
