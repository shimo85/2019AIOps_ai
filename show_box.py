import os.path as pth
import pandas as pd
import matplotlib.pyplot as plt
from conf import *


def show_t_values(is_show_pre=False, save_path=None, is_show=False):
    f_path = pth.join('rundata', 't_value_output', 't_values_with_pre_dev_lable.csv')
    df = pd.read_csv(f_path)
    plt.figure()
    plt.plot(df['timestamp'], df['t_value'], label='t_values')
    if is_show_pre:
        plt.plot(df['timestamp'], df['prediction'], label='prediction')
    plt.legend()
    if save_path:
        plt.savefig(save_path)
    if is_show:
        plt.show()
    pass


def show_check_view_count(save_path=None, is_show=False):
    f_pth = pth.join('rundata', 'check_view.csv')
    df = pd.read_csv(f_pth)
    plt.figure()
    plt.plot(df['timestamp'], df['count'], label='count')
    plt.legend()
    if save_path:
        plt.savefig(save_path)
    if is_show:
        plt.show()
    pass


def show_check_view(save_path=None, is_show=False):
    f_pth = pth.join('rundata', 'check_view.csv')
    df = pd.read_csv(f_pth)
    plt.figure()
    for i in ORIGIN_ATTRIS:
        plt.plot(df['timestamp'], df['{}_item_count'.format(i)], label=i)
    plt.legend()
    if save_path:
        plt.savefig(save_path)
    if is_show:
        plt.show()
    pass


def show_t_value_abnormal(save_path=None, is_show=False):
    df = pd.read_csv(pth.join('rundata', 't_value_output', 't_values_with_pre_dev_lable.csv'))
    abnrm_df = df[0 <> df['label']]
    print abnrm_df.count()
    plt.figure()
    plt.scatter(abnrm_df['timestamp'], abnrm_df['dev_r'])
    plt.legend()
    if save_path:
        plt.savefig(save_path)
    if is_show:
        plt.show()
    pass


def show_l1_abnrm(save_path=None, is_show=False):
    df = pd.read_csv(pth.join('rundata', 'l1_abnormal.csv'))
    plt.figure()
    for i in ORIGIN_ATTRIS:
        attri_label = '{}_abnrm_items_count'.format(i)
        attr_df = df[df[attri_label] > 0]
        plt.scatter(attr_df['timestamp'], attr_df[attri_label], label=i)
    plt.legend()
    if save_path:
        plt.savefig(save_path)
    if is_show:
        plt.show()
    pass


if __name__ == '__main__':
    # show_t_values(save_path=pth.join('datapic', 't_values.png'))
    # show_t_values(is_show_pre=True, save_path=pth.join('datapic', 't_values_pre.png'))
    # show_t_value_abnormal(save_path=pth.join('datapic', 't_values_dev.png'))

    # show_check_view_count(save_path=pth.join('datapic', 'check_view_count.png'))
    # show_check_view(save_path=pth.join('datapic', 'check_view.png'))

    show_l1_abnrm(save_path=pth.join('datapic', 'l1_abnormal.png'))

    pass
