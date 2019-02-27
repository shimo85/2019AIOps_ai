import os.path as pth
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from conf import *


def prediction_by_different_classifier(df, abnrm_ts_f_pth=None):
    clf = RandomForestClassifier(max_depth=15, n_estimators=10, max_features=1)
    # preprocess dataset, split into training and test part
    r_count, _ = df.shape
    X_train = df['timestamp'].values.reshape(-1, 1)
    # X_train = df.index.values.reshape(-1, 1)
    y_train = df['t_value'].values
    try:
        # tsc = time.time()
        clf.fit(X_train, y_train)
        # trc = time.time()
        if not abnrm_ts_f_pth:
            return clf.predict(X_train)
        else:
            abnrm_ts_df = pd.read_csv(abnrm_ts_f_pth)
            return clf.predict(abnrm_ts_df['timestamp'].values.reshape(-1, 1))
            # tac = time.time()
    except Exception, ex:
        print 'Error: %s' % ex.message


def get_abnrm_ts(abnrm_ts_f_pth=None):
    if not abnrm_ts_f_pth:
        return None
    else:
        abnrm_ts_df = pd.read_csv(abnrm_ts_f_pth)
        return abnrm_ts_df['timestamp'].values.reshape(-1, 1)


def prediction_l1_values(f_path=pth.join('rundata', 'l1_value_output'), abnrm_ts_f_pth=None):
    X_test = get_abnrm_ts(abnrm_ts_f_pth)

    for attri in ORIGIN_ATTRIS:
        df = pd.read_csv(pth.join(f_path, '{}_values.csv'.format(attri)), index_col='timestamp')
        for item in df.columns:
            clf = RandomForestClassifier(max_depth=15, n_estimators=10, max_features=1)
            item_df = df[item].dropna()
            X_train = item_df.index.values.reshape(-1, 1)
            y_train = item_df.values.ravel()
            try:
                clf.fit(X_train, y_train)
                X_test = X_train if not abnrm_ts_f_pth else X_test
                predictions = clf.predict(X_test)
                # df = df.append(pd.Series(predictions, index=X_test.ravel(), name='{}_prediction'.format(item)))
                df['{}_prediction'.format(item)] = pd.Series(predictions, index=X_test.ravel())
                # print df.head()
            except Exception, ex:
                print 'Error: %s' % ex.message
        df.to_csv(pth.join(f_path, '{}_values_with_pre.csv'.format(attri)))
        # break
    pass


def prediction_t_values(f_pth=pth.join('rundata', 't_value_output'), abnrm_ts_f_pth=None):
    print 'do prediction t value in {}'.format(f_pth)
    df = pd.read_csv(pth.join(f_pth, 't_values.csv'), encoding='utf-8')
    # df = pd.read_csv(pth.join(f_pth, 't_values.csv'), encoding='utf-8', index_col='timestamp')
    ret_df = df
    if abnrm_ts_f_pth:
        ret_df = df[df['timestamp'].isin(pd.read_csv(abnrm_ts_f_pth)['timestamp'].values)]
    ret_df['prediction'] = prediction_by_different_classifier(df, abnrm_ts_f_pth)
    ret_df.to_csv(pth.join(f_pth, 't_values_with_pre.csv'), index=0)


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
