import os.path as pth
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from conf import *


def prediction_by_different_classifier(df):
    clf = RandomForestClassifier(max_depth=15, n_estimators=10, max_features=1)
    # preprocess dataset, split into training and test part
    r_count, _ = df.shape
    X_train = df['timestamp'].values.reshape(-1, 1)
    y_train = df['t_value'].values
    try:
        # tsc = time.time()
        clf.fit(X_train, y_train)
        # trc = time.time()
        return clf.predict(X_train)
        # tac = time.time()
    except Exception, ex:
        print 'Error: %s' % ex.message


def append_prediction(df, pre):
    df['prediction'] = pre
    # o_df = df.append(pd.DataFrame({'prediction': pre}))
    df.to_csv(pth.join('rundata', 't_value_output', 't_values_with_pre.csv'), index=0)
    pass


def prediction_l1_values():
    f_path = pth.join('rundata', 'l1_value_output')
    for attri in ORIGIN_ATTRIS:
        df = pd.read_csv(pth.join(f_path, '{}_values.csv'.format(attri)), index_col='timestamp')
        for item in df.columns:
            clf = RandomForestClassifier(max_depth=15, n_estimators=10, max_features=1)
            item_df = df[item].dropna()
            X_train = item_df.index.values.reshape(-1, 1)
            y_train = item_df.values
            try:
                clf.fit(X_train, y_train)
                predictions = clf.predict(X_train)
                df['{}_prediction'.format(item)] = pd.Series(predictions, index=item_df.index)
            except Exception, ex:
                print 'Error: %s' % ex.message
        df.to_csv(pth.join(f_path, '{}_values_with_pre.csv'.format(attri)))
    pass


def prediction_t_values():
    f_path = pth.join('rundata', 't_value_output', 't_values.csv')
    df = pd.read_csv(f_path, encoding='utf-8')
    pre_values = prediction_by_different_classifier(df)
    append_prediction(df, pre_values)


def cluster_abnormal_ts():
    df = pd.read_csv(pth.join('rundata', 'abnormal_timestamp.csv'))
    K = range(2, 10)
    for k in K:
        clf = KMeans(n_clusters=k)
        print 'n_clusters: {}'.format(k)
        clf_pre = clf.fit_predict(df['timestamp'].reshape(-1, 1))
        print clf_pre
        # break
    pass


if __name__ == '__main__':
    # prediction_t_values()
    # prediction_l1_values()
    cluster_abnormal_ts()
    pass
