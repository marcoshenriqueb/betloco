# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-29 01:41
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('market', '0009_operation_from_liquidation'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='from_liquidation',
            field=models.BooleanField(default=0),
        ),
    ]
