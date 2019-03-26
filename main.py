import os.path as pth
import my_util as utl
import preprocess as preprc
import prediction as pdc
import detect_abnormal as deabnrm

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
    pdc.prediction_t_values(t_output_pth, abnrm_ts_f_pth)
    # deabnrm.detect_t_value(t_output_pth, .000001)

    l1_output_pth = pth.join(temp_pth, 'l1_value_output')
    # utl.reset_dir(l1_output_pth)
    # l1_abnrm_set_f_pth = pth.join(l1_output_pth, 'l1_abnormal_set.csv')
    # preprc.get_l1_abnormal_set(origin_f_pth, abnrm_ts_f_pth, l1_abnrm_set_f_pth)
    # preprc.col_l1_values(origin_f_pth, l1_output_pth, l1_abnrm_set_f_pth)
    # pdc.prediction_l1_values(l1_output_pth, abnrm_ts_f_pth)

    # TODO: build attri model in level 1


    pass
