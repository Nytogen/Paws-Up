# Generated by Django 3.2.7 on 2021-11-09 18:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0002_productpurchaserecord'),
        ('PawsUpAdmin', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('product.product',),
        ),
    ]
