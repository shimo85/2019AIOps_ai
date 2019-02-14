import os.path as pth
import my_util as utl
import preprocess as preprc
import prediction as pdc
import detect_abnormal as deabnrm

if __name__ == '__main__':
    origin_f_pth = pth.join('rundata', 'origin_data')
    abnrm_ts_f_pth = pth.join('rundata', 'abnormal_timestamp.csv')

    temp_pth = pth.join('rundata', 'temp')
    # utl.reset_dir(temp_pth)

    t_output_pth = pth.join(temp_pth, 't_value_output')
    # utl.reset_dir(t_output_pth)

    # preprc.col_total_values(origin_f_pth, output_pth=t_output_pth)
    # pdc.prediction_t_values(t_output_pth, abnrm_ts_f_pth)
    deabnrm.detect_t_value(t_output_pth, .000001)

    # TODO: collect l1 values

    # TODO: build attri model in level 1


    pass
