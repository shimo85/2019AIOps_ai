# How many attributes in origin data?
ATTRI_COUNT = 5

ORIGIN_ATTRIS = []
for i in range(ATTRI_COUNT):
    ORIGIN_ATTRIS.append('attri_{}'.format(i + 1))

ORIGIN_COLUMN = list(ORIGIN_ATTRIS)
ORIGIN_COLUMN.append('value')

print 'origin columns: {}'.format(ORIGIN_COLUMN)
