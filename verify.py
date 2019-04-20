import pandas as pd
import os
import os.path as pth
import my_util as utl

ts_list = list()

# f_pth = pth.join('rundata', 'origin_data')
# for f in os.listdir(f_pth):
#     ts_list.append([utl.transfer_file_name_to_timestamp(f), pth.join(f_pth, f)])

f_pth = pth.join('rundata', 'test1_data')
for f in os.listdir(f_pth):
    ts_list.append([utl.transfer_file_name_to_timestamp(f), pth.join(f_pth, f)])

f_df = pd.DataFrame(ts_list, columns=['timestamp', 'fpth']).sort_values('timestamp')

# f_df.index = pd.to_datetime(f_df['timestamp'], unit='ms')

print f_df.head()

sample_df = pd.DataFrame()
# sample_df = f_df['timestamp'][:200]
sample_df['timestamp'] = f_df.sample(n=200).sort_values('timestamp')['timestamp']

sample_df.to_csv(pth.join('rundata', 'anomaly_times_from_verify.csv'), index=None)
