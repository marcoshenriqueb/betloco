# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-28 21:04
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('market', '0004_auto_20160628_2033'),
    ]

    operations = [
        migrations.AddField(
            model_name='market',
            name='winning_choice',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='market_from_winning', to='market.Choice'),
        ),
    ]
