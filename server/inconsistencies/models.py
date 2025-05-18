from django.db import models


class NCMXInconsistencies(models.Model):
    num_nonconf = models.IntegerField(primary_key=True)
    department = models.CharField(max_length=10, blank=True, null=True, db_comment='Ответственное подразделение')
    norm_doc = models.CharField(max_length=100, blank=True, null=True, db_comment='Нормативный документ')
    point = models.CharField(max_length=50, blank=True, null=True, db_comment='Номер пункта нормативного документа')
    nonconf = models.CharField(max_length=1000, blank=True, null=True, db_comment='Описание несоответствия')
    report = models.CharField(max_length=100, blank=True, null=True, db_comment='Источник информации о несоответствии')
    report_date = models.DateField(blank=True, null=True, db_comment='Дата утверждения источника')
    analysis_start_date = models.DateField(blank=True, null=True, db_comment='Дата начала проведения анализа')
    analysis_finish_date = models.DateField(blank=True, null=True, db_comment='Дата окончания проведения анализа')
    head_auditor = models.CharField(max_length=50, blank=True, null=True, db_comment='Главный аудитор')
    auditor = models.CharField(max_length=50, blank=True, null=True, db_comment='Аудитор')
    reason = models.CharField(max_length=100, blank=True, null=True, db_comment='Причина несоответствия')
    correction = models.CharField(max_length=1000, blank=True, null=True, db_comment='Описание коррекции')
    correction_date = models.DateField(blank=True, null=True, db_comment='Дата внедрения коррекции')
    resp_person_correction = models.CharField(max_length=50, blank=True, null=True, db_comment='Ответственное лицо')
    corrective_action = models.CharField(max_length=1000, blank=True, null=True, db_comment='Корректирующее действие')
    corrective_action_date = models.DateField(blank=True, null=True, db_comment='Дата внедрения кор. действия')
    resp_person_corrective_action = models.CharField(max_length=50, blank=True, null=True, db_comment='Ответственное лицо')
    estimate = models.IntegerField(blank=True, null=True, db_comment='Оценка')
    nonconf_closure_date = models.DateField(blank=True, null=True, db_comment='Дата закрытия несоответствия')
    resp_person_nonconf_closure = models.CharField(max_length=50, blank=True, null=True, db_comment='Ответственное лицо')
    auto_data = models.DateTimeField(auto_now=True, db_comment='Дата изменения строки')

    class Meta:
        db_table = 'NCMX_inconsistencies'


class NCMXInconsistencyComments(models.Model):
    num_nonconf = models.ForeignKey('NCMXInconsistencies', on_delete=models.CASCADE, db_comment='Номер несоответствия')
    comment_author = models.CharField(max_length=50, db_comment='Автор комментария подтаблица\r\n')
    comment_text = models.CharField(max_length=1000, db_comment='Текс комментария подтаблица')
    auto_data = models.DateTimeField(auto_now_add=True, db_comment='Дата создания комментария')

    class Meta:
        db_table = 'NCMX_inconsistency_comments'

    def __str__(self):
      return f'{self.comment_author} {self.auto_data}'