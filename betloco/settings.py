"""
Django settings for betloco project.

Generated by 'django-admin startproject' using Django 1.9.6.

For more information on this file, see
https://docs.djangoproject.com/en/1.9/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.9/ref/settings/
"""

import os

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'w=*e9-y@o1-@vj8&9=w*^*5fdzor0vd=)qr*4#m8t=nx4xfg*@'

ALLOWED_HOSTS = ['guroo.bet', 'betloco.herokuapp.com', 'localhost', 'www.guroo.bet',]


# Application definition

INSTALLED_APPS = [
    'front',
    'market',
    'user_profile',
    'transaction',
    'price',
    'rest_framework',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.facebook',
    'django.contrib.sites',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

SITE_ID = 1

MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
]

# SILKY_AUTHENTICATION = True
# SILKY_AUTHORISATION = True
# SILKY_META = True
# SILKY_MAX_REQUEST_BODY_SIZE = 0
# SILKY_MAX_RESPONSE_BODY_SIZE = 0

ROOT_URLCONF = 'betloco.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'betloco.wsgi.application'
LETS_ENCRYPT_KEY = "L-0tswzW1AvS8PjhmAYo0nBjMb79ODWjobUFMloY-RI"

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SOCKET_URL = os.environ.get('SOCKET_URL') or 'http://localhost:3000/'
SECURE_SSL_REDIRECT = os.environ.get('SECURE_SSL_REDIRECT') or False
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

DEBUG = os.environ.get('DEBUG') or False

DATABASES = {
    'default': {
        'ENGINE': os.environ.get('DB_ENGINE') or 'django.db.backends.sqlite3',
        'NAME': os.environ.get('DB_NAME') or os.path.join(BASE_DIR, 'db.sqlite3'),
        'USER': os.environ.get('DB_USER') or '',
        'PASSWORD': os.environ.get('DB_PASS') or '',
        'HOST': os.environ.get('DB_SERVICE') or '',
        'PORT': os.environ.get('DB_PORT') or ''
    }
}
    
from urllib.parse import urlparse
REDIS_URL = urlparse(os.environ.get('REDIS_URL')) if os.environ.get('REDIS_URL') else urlparse('http://localhost:6379/')
CACHES = {
        'default': {
            'BACKEND': 'redis_cache.RedisCache',
            'LOCATION': '%s:%s' % (REDIS_URL.hostname, REDIS_URL.port),
            'OPTIONS': {
                'PASSWORD': REDIS_URL.password,
                'DB': 1,
        }
    }
}

ES_URL = urlparse(os.environ.get('ES_URL')) if os.environ.get('ES_URL') else urlparse('http://localhost:9200/')
port = ES_URL.port or 443
ELASTICSEARCH = {
    'URL': ES_URL.scheme + '://' + ES_URL.hostname + ':' + str(port),
    'INDEX_SUFFIX': 'stage'
}
if ES_URL.username:
    ELASTICSEARCH['URL'] = ES_URL.scheme + '://'+ ES_URL.username + ':' + ES_URL.password + '@' + ES_URL.hostname + ':' + str(port)

# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

LOGIN_REDIRECT_URL = '/app/'

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
SOCIALACCOUNT_PROVIDERS = \
    {'facebook':
       {'METHOD': 'oauth2',
        'SCOPE': ['email', 'public_profile', 'user_friends'],
        # 'AUTH_PARAMS': {'auth_type': 'reauthenticate'},
        'FIELDS': [
            'id',
            'email',
            'name',
            'first_name',
            'last_name',
            'verified',
            'locale',
            'picture',
            'timezone',
            'link',
            'gender',
            'updated_time']}}

# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGE_CODE = 'pt-br'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR + '/staticfiles/'

REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny'
    ],
    'PAGE_SIZE': 20
}

STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

ADMINS = [('Marcos', 'adm@guroo.bet'),]

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.mailgun.org'
EMAIL_HOST_USER = 'postmaster@guroo.bet'
EMAIL_HOST_PASSWORD = '22d4b03e29a705329a3f053e0cf123ab'
EMAIL_PORT = 587

DEFAULT_FROM_EMAIL = "confirmacao@guroo.bet"
SERVER_EMAIL = 'adm@guroo.bet'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format' : "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
            'datefmt' : "%d/%b/%Y %H:%M:%S"
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': 'betloco.log',
            'formatter': 'verbose'
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': True,
        }
    },
    'loggers': {
        'django': {
            'handlers':['file'],
            'propagate': True,
            'level':'ERROR',
        },
        'betloco': {
            'handlers': ['file'],
            'level': 'ERROR',
        },
        'betloco.market.search': {
            'handlers': ['mail_admins'],
            'level': 'ERROR'
        }
    }
}
