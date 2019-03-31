import os.path as pth
import my_util as utl
import preprocess as preprc
import prediction as pdc
import detect_abnormal as deabnrm
import pandas as pd
from conf import *


def l1_generate_result(l1_abnrm_set_f_pth, ps_pth, output_pth):
    abnrm_df = pd.read_csv(l1_abnrm_set_f_pth, index_col='timestamp')
    abnrm_df.index = pd.to_datetime(abnrm_df.index)

    df = pd.DataFrame()

    thr = 0.5

    for attri in ORIGIN_ATTRIS:
        attri_df = pd.read_csv(pth.join(ps_pth, '{}_potential_score.csv'.format(attri)), index_col='timestamp')
        attri_df = attri_df[attri_df > thr]
        # print attri_df.head()
        df['{}_set'.format(attri)] = attri_df.apply(lambda r: '#'.join(r.dropna().index.values), axis=1)
        df['{}_set_value'.format(attri)] = attri_df.apply(lambda r: '#'.join(r.dropna().apply(str).values), axis=1)
        # break

    # print df.head()
    df.to_csv(output_pth)
    pass


if __name__ == '__main__':
    origin_f_pth = pth.join('rundata', 'origin_data')
    test_f_pth = pth.join('rundata', 'test_data')
    abnrm_ts_f_pth = pth.join('rundata', 'Anomalytime_data_test1.csv')

    temp_pth = pth.join('rundata', 'temp')
    # utl.reset_dir(temp_pth)

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
    l1_generate_result(l1_abnrm_set_f_pth, l1_ps_pth, l1_ret_f_pth)

    # TODO:


    pass
