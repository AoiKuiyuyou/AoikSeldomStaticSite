# coding: utf-8
from __future__ import absolute_import

from flask_limiter.util import get_remote_address

from . import const


DATABASE_DRIVER = 'mysql+pymysql'

DATABASE_HOST = '127.0.0.1'

DATABASE_PORT = 3306

DATABASE_NAME = 'aoiksss'

DATABASE_USERNAME = 'aoiksss'

DATABASE_PASSWORD = 'aoiksss'

SAFE_RPROXY_FIX_IS_ON = False

SAFE_RPROXY_FIX_NUM_PROXY_SERVERS = 1

SAFE_RPROXY_FIX_DETECT_MISCONFIGURATION = False

RATE_LIMITING_STRATEGY = 'fixed-window-elastic-expiry'

RATE_LIMITING_KEY_FUNC = get_remote_address

GET_COMMENTS_RATE_LIMIT = '10000/minute'

POST_COMMENT_RATE_LIMIT = '10000/minute'

SERVER_DEBUG_IS_ON = True

SERVER_HOST = '127.0.0.1'

SERVER_PORT = 8080

SITE_ROOT = '/blog'

COMMENTS_OF_POST_URI = '/api/comments-of-post'

# Only viewed comments will be sent to client side
TBL_COMMENT_COL_IS_VIEWED_V_DEFAULT = const.TBL_COMMENT_COL_IS_VIEWED_V_YES
