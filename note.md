## Missions

### 预处理

- 将原始数据转为以维度为单个文件的统计数据。文件格式为 timestamp, atrri_item_1, attri_item_2, ...
- 可视化各维度的统计数据。

### 标注异常

异常数据文件格式：timestamp, set。举例：

```
timestamp, set
1501475700, a1&b2; a3&b4
1501475760, a1&b2&x3; a4&b5&x6
```

- 人工标注异常数据。
- 算法标注异常数据。

### 训练

### 预测

### 评估

评估准确性的指标是F-score,该指标是准确率（Precision）和召回率(Recall)综合体现。具体计算如下所示：
F-score =(2 ∗ Precision ∗ Recall)/(Precision+ Recall)，其中：
Precision ＝ TP / (TP + FP)，
Recall = TP / (TP + FN)。

每个异常时刻都有一个真正的根因集合，记为S*，该集合中包含一个或多个属性值组合，参赛队伍的算法输出结果 记为S。对于S*中的每一个元素，S中包含其中一个，则算一次true positive （TP），遗漏一个算一次false negative （FN），多出一个S*中不存在的，记一次false positive （FP）。计算出所有异常时刻的F-score，求其平均值得到全局的F-score。
