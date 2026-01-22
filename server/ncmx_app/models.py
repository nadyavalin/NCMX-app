from django.db import models
from django.db.models import JSONField

class NCMXNonconformities(models.Model):
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
    resp_person_nonconf_closure = models.CharField(max_length=50, blank=True, null=True, db_comment='Ответственное лицо, закрывшее несоответствие') # пока не реализовано
    auto_data = models.DateTimeField(auto_now=True, db_comment='Дата изменения строки')
    is_archived = models.BooleanField(default=False, db_comment='Флаг архивации')

    class Meta:
        db_table = 'NCMX_nonconformities'

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
    resp_person_observation_closure = models.CharField(max_length=50, blank=True, null=True, db_comment='Ответственное лицо, закрывшее наблюдение') # пока не реализовано
    auto_data = models.DateTimeField(auto_now=True, db_comment='Дата изменения строки')
    is_archived = models.BooleanField(default=False, db_comment='Флаг архивации')

    class Meta:
        db_table = 'NCMX_observations'

class NCMXImprovements(models.Model):
    num_improvement = models.IntegerField(primary_key=True)
    improvement = models.CharField(max_length=1000, blank=True, null=True, db_comment='Описание возможности улучшения')
    report = models.CharField(max_length=100, blank=True, null=True, db_comment='Источник информации о возможности для улучшения')
    report_date = models.DateField(blank=True, null=True, db_comment='Дата утверждения источника')
    date_implementation_for_improvement = models.DateTimeField(blank=True, null=True, db_comment='Дата реализации возможности для улучшения')
    resp_persons_for_improvement_implementation = JSONField(default=list, blank=True, db_comment='Список ответственных за реализацию')
    improvement_closure_date = models.DateTimeField(blank=True, null=True, db_comment='Дата закрытия возможности для улучшения')
    resp_person_improvement_closure = models.CharField(max_length=50, blank=True, null=True, db_comment='Ответственное лицо, закрывшее возможность для улучшения') # пока не реализовано
    auto_data = models.DateTimeField(auto_now=True, db_comment='Дата изменения строки')
    is_archived = models.BooleanField(default=False, db_comment='Флаг архивации')

    class Meta:
        db_table = 'NCMX_improvements'

class CommentType(models.TextChoices):
    NONCONFORMITY = 'nonconformity', 'Несоответствие'
    OBSERVATION = 'observation', 'Наблюдение' 
    IMPROVEMENT = 'improvement', 'Возможность улучшения'

class NCMXCommentManager(models.Manager):
    def for_nonconformity(self, num_nonconf):
        return self.filter(
            content_type=CommentType.NONCONFORMITY, 
            object_id=num_nonconf
        ).order_by('-created_at')
    
    def for_observation(self, num_observation):
        return self.filter(
            content_type=CommentType.OBSERVATION, 
            object_id=num_observation
        ).order_by('-created_at')
    
    def for_improvement(self, num_improvement):
        return self.filter(
            content_type=CommentType.IMPROVEMENT, 
            object_id=num_improvement
        ).order_by('-created_at')
    
class NCMXComment(models.Model):
    content_type = models.CharField(
        max_length=20, 
        choices=CommentType.choices,
        db_comment='Тип комментируемой сущности'
    )
    object_id = models.IntegerField(
        db_comment='ID сущности (num_nonconf, num_observation, num_improvement)'
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
        if self.content_type == CommentType.NONCONFORMITY:
            try:
                from .models import NCMXNonconformities
                return NCMXNonconformities.objects.get(num_nonconf=self.object_id)
            except NCMXNonconformities.DoesNotExist:
                return None
        elif self.content_type == CommentType.OBSERVATION:
            try:
                from .models import NCMXObservations
                return NCMXObservations.objects.get(num_observation=self.object_id)
            except NCMXObservations.DoesNotExist:
                return None
        elif self.content_type == CommentType.IMPROVEMENT:
            try:
                from .models import NCMXImprovements
                return NCMXImprovements.objects.get(num_improvement=self.object_id)
            except NCMXImprovements.DoesNotExist:
                return None
        return None
    
class RescheduleCommentType(models.TextChoices):
    NONCONFORMITY = 'nonconformity', 'Несоответствие'
    OBSERVATION = 'observation', 'Наблюдение' 
    IMPROVEMENT = 'improvement', 'Возможность улучшения'

class NCMXRescheduleCommentManager(models.Manager):
    def for_nonconformity(self, num_nonconf):
        return self.filter(
            content_type=RescheduleCommentType.NONCONFORMITY, 
            object_id=num_nonconf
        ).order_by('created_at')  # Для истории сроков сортируем по возрастанию
    
    def for_observation(self, num_observation):
        return self.filter(
            content_type=RescheduleCommentType.OBSERVATION, 
            object_id=num_observation
        ).order_by('created_at')
    
    def for_improvement(self, improvement_id):
        return self.filter(
            content_type=RescheduleCommentType.IMPROVEMENT, 
            object_id=improvement_id
        ).order_by('created_at')

class NCMXRescheduleComment(models.Model):
    content_type = models.CharField(
        max_length=20, 
        choices=RescheduleCommentType.choices,
        db_comment='Тип сущности, для которой переносится срок'
    )
    object_id = models.IntegerField(
        db_comment='ID сущности (num_nonconf, num_observation, improvement_id)'
    )
    comment_author = models.CharField(
        max_length=50, 
        db_comment='Автор комментария о переносе'
    )
    comment_text = models.CharField(
        max_length=1000, 
        db_comment='Причина переноса срока'
    )

    old_date = models.DateTimeField(
        blank=True, 
        null=True,
        db_comment='Предыдущая дата выполнения'
    )
    new_date = models.DateTimeField(
        blank=True, 
        null=True,
        db_comment='Новая дата выполнения'
    )

    # Тип переносимого действия (для уточнения, какой именно срок переносится)
    action_type = models.CharField(
        max_length=50,
        choices=[
            ('correction', 'Коррекция'),
            ('corrective_action', 'Корректирующее действие'),
            ('solution', 'Решение'),
        ],
        blank=True,
        null=True,
        db_comment='Тип действия, для которого переносится срок'
    )
    
    # ID конкретного действия в JSON поле (если применимо)
    action_index = models.IntegerField(
        blank=True, 
        null=True,
        db_comment='Индекс действия в массиве (для corrections, corrective_actions, solutions)'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_comment='Дата создания записи о причине переноса срока'
    )

    class Meta:
        db_table = 'NCMX_reschedule_comments'
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['content_type', 'object_id', 'action_type']),
        ]
        db_table_comment = 'Таблица для комментариев о переносе сроков'

    def __str__(self):
        return f'Перенос срока - {self.comment_author} - {self.content_type} #{self.object_id} - {self.created_at}'

    def get_related_object(self):
        """Получить связанный объект"""
        if self.content_type == RescheduleCommentType.NONCONFORMITY:
            try:
                return NCMXNonconformities.objects.get(num_nonconf=self.object_id)
            except NCMXNonconformities.DoesNotExist:
                return None
        elif self.content_type == RescheduleCommentType.OBSERVATION:
            try:
                return NCMXObservations.objects.get(num_observation=self.object_id)
            except NCMXObservations.DoesNotExist:
                return None
        # Добавить аналогично для возможностей улучшения
        return None

    def get_date_change_description(self):
        """Получить текстовое описание изменения даты"""
        if self.old_date and self.new_date:
            return f"Дата изменена с {self.old_date.strftime('%d.%m.%Y')} на {self.new_date.strftime('%d.%m.%Y')}"
        elif self.new_date:
            return f"Установлена новая дата: {self.new_date.strftime('%d.%m.%Y')}"
        elif self.old_date:
            return f"Дата {self.old_date.strftime('%d.%m.%Y')} была удалена"
        return "Изменение даты"