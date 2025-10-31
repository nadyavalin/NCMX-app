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

class NCMXObservations(models.Model):
    num_observation = models.IntegerField(primary_key=True)
    normative_documents = JSONField(default=list, blank=True, db_comment='Список нормативных документов и пунктов')
    observation = models.CharField(max_length=1000, blank=True, null=True, db_comment='Описание наблюдения')
    report = models.CharField(max_length=100, blank=True, null=True, db_comment='Источник информации о наблюдении')
    report_date = models.DateField(blank=True, null=True, db_comment='Дата утверждения источника')
    analysis_start_date = models.DateField(blank=True, null=True, db_comment='Дата начала проведения анализа')
    analysis_finish_date = models.DateField(blank=True, null=True, db_comment='Дата окончания проведения анализа')
    solutions = JSONField(default=list, blank=True, db_comment='Список решений (описание, дата, ответственные)')
    observation_closure_date = models.DateTimeField(blank=True, null=True, db_comment='Дата закрытия наблюдения')
    resp_person_observation_closure = models.CharField(max_length=50, blank=True, null=True, db_comment='Ответственное лицо')
    auto_data = models.DateTimeField(auto_now=True, db_comment='Дата изменения строки')
    is_archived = models.BooleanField(default=False, db_comment='Флаг архивации')

    class Meta:
        db_table = 'NCMX_observations'

class CommentType(models.TextChoices):
    INCONSISTENCY = 'inconsistency', 'Несоответствие'
    OBSERVATION = 'observation', 'Наблюдение' 
    IMPROVEMENT = 'improvement', 'Возможность улучшения'

class NCMXCommentManager(models.Manager):
    def for_inconsistency(self, num_nonconf):
        return self.filter(
            content_type=CommentType.INCONSISTENCY, 
            object_id=num_nonconf
        ).order_by('-created_at')
    
    def for_observation(self, num_observation):
        return self.filter(
            content_type=CommentType.OBSERVATION, 
            object_id=num_observation
        ).order_by('-created_at')
    
    def for_entity(self, content_type, object_id):
        return self.filter(
            content_type=content_type,
            object_id=object_id
        ).order_by('-created_at')

class NCMXComment(models.Model):
    content_type = models.CharField(
        max_length=20, 
        choices=CommentType.choices,
        db_comment='Тип комментируемой сущности'
    )
    object_id = models.IntegerField(
        db_comment='ID сущности (num_nonconf, num_observation, etc)'
    )
    comment_author = models.CharField(
        max_length=50, 
        db_comment='Автор комментария'
    )
    comment_text = models.CharField(
        max_length=1000, 
        db_comment='Текст комментария'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_comment='Дата создания комментария'
    )

    class Meta:
        db_table = 'NCMX_comments'
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
        ]
        db_table_comment = 'Универсальная таблица комментариев'

    def __str__(self):
        return f'{self.comment_author} - {self.content_type} #{self.object_id} - {self.created_at}'

    # Методы для удобства
    def get_related_object(self):
        """Получить связанный объект"""
        if self.content_type == CommentType.INCONSISTENCY:
            try:
                from .models import NCMXInconsistencies
                return NCMXInconsistencies.objects.get(num_nonconf=self.object_id)
            except NCMXInconsistencies.DoesNotExist:
                return None
        elif self.content_type == CommentType.OBSERVATION:
            try:
                from .models import NCMXObservations
                return NCMXObservations.objects.get(num_observation=self.object_id)
            except NCMXObservations.DoesNotExist:
                return None
        return None