# Generated by Django 3.2.7 on 2021-11-05 18:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0012_alter_service_verified_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='service',
            name='verified_status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Verified', 'Verified'), ('Denied', 'Denied'), ('NoVeriFiles', 'NoVeriFiles')], default='NoVeriFiles', max_length=20),
        ),
    ]
