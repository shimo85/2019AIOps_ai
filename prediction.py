import os.path as pth
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier


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


if __name__ == '__main__':
    f_path = pth.join('rundata', 't_value_output', 't_values.csv')
    df = pd.read_csv(f_path, encoding='utf-8')

    pre_values = prediction_by_different_classifier(df)

    # plt.figure()
    # plt.plot(df['timestamp'], df['t_value'])
    # plt.plot(df['timestamp'], pre_values, label='prediction')
    # plt.legend()
    # plt.show()

    append_prediction(df, pre_values)

