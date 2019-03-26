# -*- coding:utf-8 -*-
import os.path as pth
from statsmodels.tsa.stattools import adfuller
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.arima_model import ARMA


# 移动平均图
def draw_trend(timeSeries, size):
    f = plt.figure(facecolor='white')
    # 对size个数据进行移动平均
    rol_mean = timeSeries.rolling(window=size).mean()
    # 对size个数据进行加权移动平均
    rol_weighted_mean = pd.ewma(timeSeries, span=size)

    timeSeries.plot(color='blue', label='Original')
    rol_mean.plot(color='red', label='Rolling Mean')
    rol_weighted_mean.plot(color='black', label='Weighted Rolling Mean')
    plt.legend(loc='best')
    plt.title('Rolling Mean')
    plt.show()


def draw_ts(timeSeries):
    f = plt.figure(facecolor='white')
    timeSeries.plot(color='blue')
    plt.show()


'''
　　Unit Root Test
   The null hypothesis of the Augmented Dickey-Fuller is that there is a unit
   root, with the alternative that there is no unit root. That is to say the
   bigger the p-value the more reason we assert that there is a unit root
'''


def testStationarity(ts):
    dftest = adfuller(ts)
    # 对上述函数求得的值进行语义描述
    dfoutput = pd.Series(dftest[0:4], index=['Test Statistic', 'p-value', '#Lags Used', 'Number of Observations Used'])
    for key, value in dftest[4].items():
        dfoutput['Critical Value (%s)' % key] = value
    return dfoutput


# 自相关和偏相关图，默认阶数为31阶
def draw_acf_pacf(ts, lags=31):
    f = plt.figure(facecolor='white')
    ax1 = f.add_subplot(211)
    plot_acf(ts, lags=lags, ax=ax1)
    ax2 = f.add_subplot(212)
    plot_pacf(ts, lags=lags, ax=ax2)
    plt.show()


if __name__ == '__main__':
    abnrm_ts_f_pth = pth.join('rundata', 'Anomalytime_data_test1.csv')
    temp_pth = pth.join('rundata', 'temp')
    t_output_pth = pth.join(temp_pth, 't_value_output')

    origin_df = pd.read_csv(pth.join(t_output_pth, 'origin_t_values.csv'), index_col='timestamp')
    test_df = pd.read_csv(pth.join(t_output_pth, 'test_t_values.csv'), index_col='timestamp')
    # anm_df = pd.read_csv(abnrm_ts_f_pth)
    # df = test_df.loc[anm_df['timestamp'].tolist()]
    df = origin_df.append(test_df)
    df.index = pd.to_datetime(df.index, unit='ms')

    ts = df['t_value']

    print ts.head()
    print ts.head().index
    print ts.tail()

    # draw_ts(ts)
    # draw_acf_pacf(ts)
    print testStationarity(ts)

    # ts_log = np.log(ts)
    # draw_ts(ts_log)
    # print testStationarity(ts_log)

    draw_trend(ts, 12)
    draw_trend(ts, 12 * 2)
    draw_trend(ts, 12 * 24)

    # # model = ARMA(ts, order=(0, 0))
    # model = ARMA(ts, order=(1, 1))
    # # model = ARMA(ts, order=(0, 1))
    # # model = ARMA(ts, order=(1, 0))
    # # model = ARMA(ts, order=(0, 2))
    # result_arma = model.fit(disp=-1, method='css')
    # predict_ts = result_arma.predict()
    #
    # # print ts.size
    # # print predict_ts.size
    #
    # ts = ts[predict_ts.index]
    #
    # plt.figure(facecolor='white')
    # predict_ts.plot(color='blue', label='Predict')
    # ts.plot(color='red', label='Original')
    # plt.legend(loc='best')
    # plt.title('RMSE: %.4f' % np.sqrt(sum((predict_ts - ts) ** 2) / ts.size))
    # plt.show()

    pass
