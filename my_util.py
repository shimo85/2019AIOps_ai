import os


def transfer_file_name_to_timestamp(f_name):
    return f_name[:-4]


def del_file(path):
    for i in os.listdir(path):
        path_file = os.path.join(path, i)
        if os.path.isfile(path_file):
            os.remove(path_file)
        else:
            del_file(path_file)


def reset_dir(f_path):
    if os.path.exists(f_path):
        del_file(f_path)
    else:
        os.mkdir(f_path)
