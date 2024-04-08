from django.db import models
# USER RELATED TABLES
class users(models.Model):
    username = models.CharField(max_length=200,null=False,blank=False)
    password = models.CharField(max_length=600,null=False,blank=False)
    def __str__(self):
        return self.employeeId
    
