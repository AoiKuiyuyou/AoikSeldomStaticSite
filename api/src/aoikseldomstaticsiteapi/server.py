# coding: utf-8
from __future__ import absolute_import

import datetime

from flask import Blueprint
from flask import Flask
from flask import abort
from flask import jsonify
from flask import request
from flask_limiter import Limiter

from . import config
from . import const
from .database import Comment
from .database import CommentMaxID
from .database import create_all_tables
from .database import session_context
from .saferproxyfix import SaferProxyFix


FLASK_APP = Flask(__name__)


if config.SAFE_RPROXY_FIX_IS_ON:
    FLASK_APP.wsgi_app = SaferProxyFix(
        FLASK_APP.wsgi_app,
        num_proxy_servers=config.SAFE_RPROXY_FIX_NUM_PROXY_SERVERS,
        detect_misconfiguration=config.SAFE_RPROXY_FIX_DETECT_MISCONFIGURATION,
    )


BLUEPRINT = Blueprint('aoikseldomstaticsiteapi', __name__,
                      template_folder='templates')


RATE_LIMITER = Limiter(
    strategy=config.RATE_LIMITING_STRATEGY,
    key_func=config.RATE_LIMITING_KEY_FUNC,
)
RATE_LIMITER.init_app(FLASK_APP)


@BLUEPRINT.route(config.COMMENTS_OF_POST_URI + '/<int:post_id>')
@RATE_LIMITER.limit(config.GET_COMMENTS_RATE_LIMIT)
def get_comments(post_id):
    with session_context() as session:
        comment_objs = session.query(Comment).filter(
            Comment.post_id == post_id,
            Comment.is_viewed == const.TBL_COMMENT_COL_IS_VIEWED_V_YES,
            Comment.is_blocked == const.TBL_COMMENT_COL_IS_BLOCKED_V_NO,
        ).order_by(Comment.create_time).all()

        comment_infos = []

        for comment_obj in comment_objs:
            comment_info = {
                'post_id': post_id,
                'comment_id': comment_obj.comment_id,
                'replyto_comment_id': comment_obj.replyto_comment_id,
                'create_time':
                    comment_obj.create_time.strftime('%Y-%m-%d %H:%M:%S'),
                'commenter_name': comment_obj.commenter_name,
                'comment_content': comment_obj.comment_content,
                'is_admin': comment_obj.is_admin,
            }
            comment_infos.append(comment_info)

        return jsonify({
            'comment_infos': comment_infos
        })


@BLUEPRINT.route(config.COMMENTS_OF_POST_URI + '/<int:post_id>',
                 methods=['POST'])
@RATE_LIMITER.limit(config.POST_COMMENT_RATE_LIMIT)
def post_comment(post_id):
    commenter_name = request.form['commenter_name']
    comment_content = request.form['comment_content']
    replyto_comment_id = request.form.get('replyto_comment_id', None)

    if not replyto_comment_id:
        replyto_comment_id = 0
    else:
        # Prevent long string attack
        if len(replyto_comment_id) > 5:
            abort(400, '`replyto_comment_id` is too long.')

        try:
            replyto_comment_id = int(replyto_comment_id)

            if replyto_comment_id < 0:
                raise ValueError()
        except ValueError:
            abort(400, '`replyto_comment_id` is not a positive integer.')

    with session_context() as session:
        if replyto_comment_id > 0:
            reply_to_comment_obj = session.query(Comment) \
                .filter(Comment.post_id == post_id,
                        Comment.comment_id == replyto_comment_id) \
                .first()

            if reply_to_comment_obj is None:
                abort(400,
                      '`replyto_comment_id` not maps to an existing comment.')

        maxid_obj = session.query(CommentMaxID)\
            .filter(CommentMaxID.post_id == post_id)\
            .with_for_update().first()

        if maxid_obj is None:
            maxid_obj = CommentMaxID()
            maxid_obj.post_id = post_id
            maxid_obj.comment_id = 0
            session.add(maxid_obj)
            session.commit()

            maxid_obj = session.query(CommentMaxID)\
                .filter(CommentMaxID.post_id == post_id)\
                .with_for_update().first()

        maxid_obj.comment_id += 1

        comment_obj = Comment()
        comment_obj.post_id = post_id
        comment_obj.comment_id = maxid_obj.comment_id
        comment_obj.create_time = datetime.datetime.now()
        comment_obj.commenter_name = commenter_name
        comment_obj.comment_content = comment_content
        comment_obj.replyto_comment_id = replyto_comment_id
        comment_obj.is_admin = const.TBL_COMMENT_COL_IS_ADMIN_V_NO
        comment_obj.is_viewed = config.TBL_COMMENT_COL_IS_VIEWED_V_DEFAULT
        comment_obj.is_blocked = const.TBL_COMMENT_COL_IS_BLOCKED_V_NO

        session.add(maxid_obj)
        session.add(comment_obj)

        session.commit()

        result_info = {
            'is_viewed': comment_obj.is_viewed
        }

        if comment_obj.is_viewed == const.TBL_COMMENT_COL_IS_VIEWED_V_YES:
            result_info.update({
                'comment_id': maxid_obj.comment_id,
                'replyto_comment_id': replyto_comment_id,
                'create_time':
                    comment_obj.create_time.strftime('%Y-%m-%d %H:%M:%S'),
                'is_admin': comment_obj.is_admin,
            })

        return jsonify(result_info)


@FLASK_APP.errorhandler(400)
def response400(error):
    response = jsonify({
        'status': 400,
        'message': error.description
    })
    return response, 400


@FLASK_APP.errorhandler(429)
def response429(error):
    response = jsonify({
        'status': 429,
        'message': 'Rate limit exceeded.'
    })
    return response, 429


@FLASK_APP.errorhandler(500)
def response500(error):
    response = jsonify({
        'status': 500,
        'message': 'Server error.'
    })
    return response, 500


def main(args=None):
    create_all_tables()

    FLASK_APP.register_blueprint(BLUEPRINT, url_prefix=config.SITE_ROOT)

    FLASK_APP.run(
        debug=config.SERVER_DEBUG_IS_ON,
        host=config.SERVER_HOST,
        port=config.SERVER_PORT,
    )
