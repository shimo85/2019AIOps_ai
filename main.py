import os.path as pth
import my_util as utl
import preprocess as preprc
import prediction as pdc
import detect_abnormal as deabnrm
import pandas as pd
from conf import *
import matplotlib.pyplot as plt
import dateutil.parser as dateparser
import time


def l1_generate_result(l1_abnrm_set_f_pth, ps_pth, output_pth, thr):
    abnrm_df = pd.read_csv(l1_abnrm_set_f_pth, index_col='timestamp')
    abnrm_df.index = pd.to_datetime(abnrm_df.index)

    df = pd.DataFrame()

    for attri in ORIGIN_ATTRIS:
        attri_df = pd.read_csv(pth.join(ps_pth, '{}_potential_score.csv'.format(attri)), index_col='timestamp')
        attri_df = attri_df[attri_df > thr]
        # print attri_df.head()
        df['{}_set'.format(attri)] = attri_df.apply(lambda r: '#'.join(r.dropna().index.values), axis=1)
        df['{}_set_value'.format(attri)] = attri_df.apply(lambda r: '#'.join(r.dropna().apply(str).values), axis=1)
        # break

    # print df.head()
    if output_pth:
        df.to_csv(output_pth)
    return df


def check_l1_ret(l1_ret_f_pth):
    df = pd.read_csv(l1_ret_f_pth, index_col='timestamp')
    total_size, _ = df.shape
    # print 'total size: ', total_size
    df.dropna(how='all', inplace=True)
    not_na_row, _ = df.shape
    na_size = total_size - not_na_row
    # print 'na size: ', na_size
    df = df.applymap(lambda r: True if '#' in str(r) else None)
    df.dropna(how='all', inplace=True)
    complex_size, _ = df.shape
    else_size = total_size - na_size - complex_size
    return total_size, na_size, complex_size, else_size


def insight_l1_ret(l1_abnrm_set_f_pth, l1_ps_pth, l1_ret_f_pth, out_pth):
    insight_df = pd.DataFrame()
    # for i in range(1, 10):
    for i in range(1, 15):
        thr = i / 10.
        l1_generate_result(l1_abnrm_set_f_pth, l1_ps_pth, l1_ret_f_pth, thr=thr)
        # print '-' * 8, '\t', thr, '\t', '-' * 8
        # total, na, complex_s, else_size = insight_l1_ret(l1_ret_f_pth)
        s = pd.Series(check_l1_ret(l1_ret_f_pth), index=['total_size', 'na_size', 'complex_size', 'else_size'],
                      name=thr)
        insight_df = insight_df.append(s)
    # print insight_df.head()
    insight_df.to_csv(out_pth, index_label='thr')


def ret_to_set(row):
    # TODO:
    attri_list = list()
    for attri in ORIGIN_ATTRIS:
        attri_set = row['{}_set'.format(attri)]
        if attri_set:
            t_list = attri_set.split('#')
            attri_list.append(t_list[0])
    return '&'.join(attri_list) if len(attri_list) > 0 else None


if __name__ == '__main__':
    origin_f_pth = pth.join('rundata', 'origin_data')
    # test_f_pth = pth.join('rundata', 'test1_data')
    test_f_pth = pth.join('rundata', 'test2_data')
    # abnrm_ts_f_pth = pth.join('rundata', 'Anomalytime_data_test1.csv')
    abnrm_ts_f_pth = pth.join('rundata', 'Anomalytime_data_test2.csv')
    # abnrm_ts_f_pth = pth.join('rundata', 'anomaly_times_from_verify.csv')

    temp_pth = pth.join('rundata', 'temp')
    # utl.reset_dir(temp_pth)
    final_ret_f_pth = pth.join(temp_pth, 'result.csv')

    t_output_pth = pth.join(temp_pth, 't_value_output')
    # utl.reset_dir(t_output_pth)
    # preprc.col_total_values(origin_f_pth, output_pth=pth.join(t_output_pth, 'origin_t_values.csv'))
    # preprc.col_total_values(test_f_pth, output_pth=pth.join(t_output_pth, 'test_t_values.csv'))
    # pdc.prediction_t_values(t_output_pth, abnrm_ts_f_pth)

    l1_output_pth = pth.join(temp_pth, 'l1_value_output')
    # utl.reset_dir(l1_output_pth)
    l1_abnrm_set_f_pth = pth.join(l1_output_pth, 'l1_abnormal_set.csv')
    # preprc.get_l1_abnormal_set(test_f_pth, abnrm_ts_f_pth, l1_abnrm_set_f_pth)
    l1_origin_data = pth.join(l1_output_pth, 'origin')
    # preprc.col_l1_values(origin_f_pth, l1_origin_data, l1_abnrm_set_f_pth)
    l1_test_data = pth.join(l1_output_pth, 'test')
    # preprc.col_l1_values(test_f_pth, l1_test_data, l1_abnrm_set_f_pth)
    l1_pre = pth.join(l1_output_pth, 'pre')
    # pdc.prediction_l1_values(l1_origin_data, l1_test_data, abnrm_ts_f_pth, l1_pre)
    l1_ps_pth = pth.join(l1_output_pth, 'potential_score')
    # deabnrm.cal_l1_potential_score(pth.join(t_output_pth, 't_values_with_pre.csv'), l1_pre, l1_abnrm_set_f_pth,
    #                                l1_ps_pth)
    l1_ret_f_pth = pth.join(l1_output_pth, 'l1_result.csv')
    out_pth = pth.join(l1_output_pth, 'l1_insight.csv')
    # insight_l1_ret(l1_abnrm_set_f_pth, l1_ps_pth, l1_ret_f_pth, out_pth)

    l1_ret_not_na_df = l1_generate_result(l1_abnrm_set_f_pth, l1_ps_pth, l1_ret_f_pth, thr=.5)
    # l1_ret_less_complex_df = l1_generate_result(l1_abnrm_set_f_pth, l1_ps_pth, l1_ret_f_pth, thr=.8)
    l1_ret_less_complex_df = l1_generate_result(l1_abnrm_set_f_pth, l1_ps_pth, l1_ret_f_pth, thr=1.)

    # l1_ret_not_na_df['set'] = l1_ret_not_na_df.apply(ret_to_set, axis=1)

    # print l1_ret_not_na_df['set'].head()

    final_ret_df = pd.DataFrame()
    # print l1_ret_not_na_df.index
    # final_ret_df['timestamp'] = l1_ret_not_na_df.index
    final_ret_df['set'] = l1_ret_less_complex_df.apply(ret_to_set, axis=1)
    na_index = final_ret_df[final_ret_df['set'].isna()].index
    print na_index
    final_ret_df['set'].update(l1_ret_not_na_df.loc[na_index].apply(ret_to_set, axis=1))
    # final_ret_df['timestamp'] = final_ret_df['d_timestamp'].apply(
    #     lambda r: (int(time.mktime(dateparser.parse(r).timetuple()))) * 1000)
    # final_ret_df['td_timestamp'] = pd.to_datetime(final_ret_df['timestamp'], unit='ms')
    # final_ret_df['set']
    # print final_ret_df.head()
    final_ret_df.to_csv(final_ret_f_pth)

    pass
