# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-06-01 00:23
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('market', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='MarketCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.AlterField(
            model_name='choice',
            name='market',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='choices', to='market.Market'),
        ),
        migrations.AlterField(
            model_name='market',
            name='market_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='market.MarketType'),
        ),
        migrations.AddField(
            model_name='market',
            name='market_category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='market.MarketCategory'),
        ),
    ]
