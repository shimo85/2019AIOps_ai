import os.path as pth
import my_util as utl
import preprocess as preprc
import prediction as pdc

if __name__ == '__main__':
    origin_f_pth = pth.join('rundata', 'origin_data')
    abnrm_ts_f_pth = pth.join('rundata', 'abnormal_timestamp.csv')

    temp_pth = pth.join('rundata', 'temp')
    utl.reset_dir(temp_pth)

    t_output_pth = pth.join(temp_pth, 't_value_output')
    utl.reset_dir(t_output_pth)
    preprc.col_total_values(origin_f_pth, output_pth=t_output_pth)

    # TODO: input abnormal timestamps
    pdc.prediction_t_values(t_output_pth)

    # TODO: cal t value dev of abnrm ts

    # TODO: collect l1 values

    # TODO: build attri model in level 1


    pass
