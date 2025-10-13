from django.db import models
from django.db.models import JSONField

class NCMXInconsistencies(models.Model):
    num_nonconf = models.IntegerField(primary_key=True)
    normative_documents = JSONField(default=list, blank=True, db_comment='Список нормативных документов и пунктов')
    nonconf = models.CharField(max_length=1000, blank=True, null=True, db_comment='Описание несоответствия')
    report = models.CharField(max_length=100, blank=True, null=True, db_comment='Источник информации о несоответствии')
    report_date = models.DateField(blank=True, null=True, db_comment='Дата утверждения источника')
    analysis_start_date = models.DateField(blank=True, null=True, db_comment='Дата начала проведения анализа')
    analysis_finish_date = models.DateField(blank=True, null=True, db_comment='Дата окончания проведения анализа')
    head_auditor = models.CharField(max_length=50, blank=True, null=True, db_comment='Главный аудитор')
    auditors = JSONField(default=list, blank=True, db_comment='Список аудиторов')
    reason = models.CharField(max_length=250, blank=True, null=True, db_comment='Причина несоответствия')
    corrections = JSONField(default=list, blank=True, db_comment='Список коррекций (описание, дата, ответственные)')
    corrective_actions = JSONField(default=list, blank=True, db_comment='Список корректирующих действий (описание, дата, ответственные)')
    estimate = models.IntegerField(blank=True, null=True, db_comment='Оценка')
    nonconf_closure_date = models.DateTimeField(blank=True, null=True, db_comment='Дата закрытия несоответствия')
    resp_person_nonconf_closure = models.CharField(max_length=50, blank=True, null=True, db_comment='Ответственное лицо')
    auto_data = models.DateTimeField(auto_now=True, db_comment='Дата изменения строки')
    is_archived = models.BooleanField(default=False, db_comment='Флаг архивации')

    class Meta:
        db_table = 'NCMX_inconsistencies'

class NCMXInconsistencyComments(models.Model):
    num_nonconf = models.ForeignKey('NCMXInconsistencies', on_delete=models.CASCADE, db_comment='Номер несоответствия')
    comment_author = models.CharField(max_length=50, db_comment='Автор комментария')
    comment_text = models.CharField(max_length=1000, db_comment='Текст комментария')
    created_at = models.DateTimeField(auto_now_add=True, db_comment='Дата создания комментария')

    class Meta:
        db_table = 'NCMX_inconsistency_comments'

    def __str__(self):
        return f'{self.comment_author} {self.created_at}'

class NCMXObservations(models.Model):
    num_observation = models.IntegerField(primary_key=True)
    normative_documents = JSONField(default=list, blank=True, db_comment='Список нормативных документов и пунктов')
    observation = models.CharField(max_length=1000, blank=True, null=True, db_comment='Описание наблюдения')
    report = models.CharField(max_length=100, blank=True, null=True, db_comment='Источник информации о наблюдении')
    report_date = models.DateField(blank=True, null=True, db_comment='Дата утверждения источника')
    analysis_start_date = models.DateField(blank=True, null=True, db_comment='Дата начала проведения анализа')
    analysis_finish_date = models.DateField(blank=True, null=True, db_comment='Дата окончания проведения анализа')
    solutions = JSONField(default=list, blank=True, db_comment='Список решений (описание, дата, ответственные)')
    solution_closure_date = models.DateTimeField(blank=True, null=True, db_comment='Дата закрытия наблюдения')
    resp_person_observation_closure = models.CharField(max_length=50, blank=True, null=True, db_comment='Ответственное лицо')
    auto_data = models.DateTimeField(auto_now=True, db_comment='Дата изменения строки')
    is_archived = models.BooleanField(default=False, db_comment='Флаг архивации')

    class Meta:
        db_table = 'NCMX_observations'

class NCMXObservationComments(models.Model):
    num_observation = models.ForeignKey('NCMXObservations', on_delete=models.CASCADE, db_comment='Номер наблюдения')
    comment_author = models.CharField(max_length=50, db_comment='Автор комментария')
    comment_text = models.CharField(max_length=1000, db_comment='Текст комментария')
    created_at = models.DateTimeField(auto_now_add=True, db_comment='Дата создания комментария')

    class Meta:
        db_table = 'NCMX_observation_comments'

    def __str__(self):
        return f'{self.comment_author} {self.created_at}'