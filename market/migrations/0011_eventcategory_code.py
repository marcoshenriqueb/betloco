# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-11 18:21
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('market', '0010_order_from_liquidation'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventcategory',
            name='code',
            field=models.CharField(default='def', max_length=3),
            preserve_default=False,
        ),
    ]
