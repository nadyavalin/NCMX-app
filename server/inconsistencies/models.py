from django.db import models


class NCMXInconsistencies(models.Model):
    num_nonconf = models.IntegerField(primary_key=True)
    department = models.CharField(max_length=10, blank=True, null=True, db_comment='Ответственное подразделение')
    norm_doc = models.CharField(max_length=100, blank=True, null=True, db_comment='Нормативный документ')
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
    auto_data = models.DateTimeField(db_comment='Дата изменения строки')

    class Meta:
        db_table = 'NCMX_inconsistencies'

    def __str__(self):
      return self.nonconf


class NCMXInconsistencyComments(models.Model):
    num_nonconf = models.OneToOneField('NCMXInconsistencies', models.DO_NOTHING, db_column='num_nonconf', primary_key=True, db_comment='Номер несоответствия')
    comment_author = models.CharField(max_length=50, db_comment='Автор комментария подтаблица\r\n')
    comment_text = models.CharField(max_length=1000, db_comment='Текс комментария подтаблица')
    auto_data = models.DateTimeField(db_comment='Дата создания комментария')

    class Meta:
        db_table = 'NCMX_inconsistency_comments'

    def __str__(self):
      return self.comment_text