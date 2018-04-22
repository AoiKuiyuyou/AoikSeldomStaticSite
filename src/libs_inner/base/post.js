//
'use strict';

(function (window) {
	var AOIKSSS =
		typeof window.AOIKSELDOMSTATICSITE ===
		'undefined' ? {} : window.AOIKSELDOMSTATICSITE;

	window.AOIKSELDOMSTATICSITE = AOIKSSS;

	AOIKSSS.util = typeof AOIKSSS.util === 'undefined' ? {} : AOIKSSS.util;

	AOIKSSS.util.escape_html = function (string) {
		var entityMap = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			'\'': '&#39;',
			'/': '&#x2F;',
			'`': '&#x60;',
			'=': '&#x3D;'
		};

		return String(string).replace(/[&<>"'`=\/]/g, function (s) {
			return entityMap[s];
		});
	};

	AOIKSSS.util.is_blank = function (string) {
		return !string || !string.trim();
	};

	AOIKSSS.util.scroll_to_hash = function (hash) {
		var element = $(hash);

		if (element.length === 0) {
			return;
		}

		$('html, body').animate({
			scrollTop: Math.floor(element.offset().top)
		}, 500, function () {
			window.location.hash = hash;
		});
	};

	AOIKSSS.post = typeof AOIKSSS.post === 'undefined' ? {} : AOIKSSS.post;

	AOIKSSS.post.comments_of_post_api = '/blog/api/comments-of-post';

	AOIKSSS.post.get_comments = function (post_id) {
		$.ajax({
			type: 'GET',
			url: AOIKSSS.post.comments_of_post_api + '/' + post_id,
			dataType: 'json',
			timeout: 5000
		}).done(function (data) {
			var comment_infos = data.comment_infos;

			AOIKSSS.vue_app.comment_infos = comment_infos;
			AOIKSSS.vue_app.comment_ids = comment_infos.map(
				function (comment_info) {
					return comment_info.comment_id;
				});
		}).fail(function (jqXHR, status, error) {
			var message;

			try {
				var responseObj = jQuery.parseJSON(jqXHR.responseText);

				message = responseObj.message;
			}
			catch (ex) {
				message = '';
			}

			toastr.error('Failed getting comments. ' + message);
		});
	};

	AOIKSSS.post.add_comment = function () {
		var is_blank = AOIKSSS.util.is_blank;

		var post_id = $('#post_id').text().trim();

		if (is_blank(post_id)) {
			toastr.error('Post ID can not be blank.');
			return;
		}

		var commenter_name = AOIKSSS.vue_app.commenter_name.trim();

		if (is_blank(commenter_name)) {
			toastr.error('Commenter name can not be blank.');
			return;
		}

		var comment_content = AOIKSSS.vue_app.comment_content.trim();

		if (is_blank(comment_content)) {
			toastr.error('Comment content can not be blank.');
			return;
		}

		var replyto_comment_id = Number(AOIKSSS.vue_app.replyto_comment_id);

		$.ajax({
			type: 'POST',
			url: AOIKSSS.post.comments_of_post_api + '/' +
				post_id,
			data: {
				commenter_name: commenter_name,
				comment_content: comment_content,
				replyto_comment_id: replyto_comment_id
			},
			dataType: 'json',
			timeout: 5000
		}).done(function (data) {
			var is_viewed = data.is_viewed;

			if (!is_viewed) {
				toastr.success('Added comment. The comment will be viewed by' +
					' the site admin before made public.');

				return;
			}

			var comment_id = Number(data.comment_id);
			var comment_infos = AOIKSSS.vue_app.comment_infos;
			var comment_infos_length = comment_infos.length;

			var i;

			for (i = 0; i < comment_infos_length; i++) {
				if (comment_infos[i].comment_id > comment_id) {
					break;
				}
			}
			comment_infos.splice(i, 0, {
				comment_id: data.comment_id,
				create_time: data.create_time,
				commenter_name: commenter_name,
				comment_content: comment_content,
				replyto_comment_id: replyto_comment_id
			});

			var comment_ids = AOIKSSS.vue_app.comment_ids;

			comment_ids.splice(i, 0, comment_id);

			var comment_href = '#comment-' + comment_id;

			// The element has not been created yet so use a timeout
			setTimeout(function () {
				AOIKSSS.util.scroll_to_hash(comment_href);

				toastr.success('Added comment ' + comment_id + '.');
			}, 0);
		}).fail(function (jqXHR, status, error) {
			var message;

			try {
				var responseObj = jQuery.parseJSON(jqXHR.responseText);

				message = responseObj.message;
			}
			catch (ex) {
				message = '';
			}

			toastr.error('Failed adding the comment. ' + message);
		});
	};
})(window);


(function (window) {
	var AOIKSSS = window.AOIKSELDOMSTATICSITE;

	function init_back_to_top_button(back_to_top_block_selector) {
		function scroll_handler() {
			var scroll_top = $(window).scrollTop();

			var win_height = $(window).height();

			if (win_height === 0) {
				return;
			}

			if (scroll_top / win_height > 0.5) {
				$(back_to_top_block_selector).removeClass('is_hidden');
			}
			else {
				$(back_to_top_block_selector).addClass('is_hidden');
			}
		}

		var scroll_timeout;

		$(window).scroll(function () {
			// If have pending timeout,
			// it means the scroll event occurs close to last scroll event.
			if (scroll_timeout) {
				// Clear the pending timeout for debounce purpose
				clearTimeout(scroll_timeout);

				scroll_timeout = null;
			}

			scroll_timeout = setTimeout(scroll_handler, 250);
		});
	}

	// Modified from another author's code. Can not recall the origin.
	function init_post_toc(targetID) {
		function repeat(str, num) {
			return new Array(num + 1).join(str);
		}

		var toc_list_html =
			'<ul class="toc_list">';

		var new_line, el, title, link, level, base_level;

		$('article h2, article h3, article h4, article h5, article h6').each(
			function (index, elem) {
				el = $(elem);
				title = el.text();
				link = '#' + el.attr('id');

				var prev_level = level || 0;

				level = elem.nodeName.substr(1);

				if (!base_level) {
					base_level = level;
				}

				if (prev_level === 0) {
					new_line = '<li>';
				}
				else if (level === prev_level) {
					new_line = '</li><li>';
				}
				else if (level > prev_level) {
					new_line = repeat('<ul><li>', level - prev_level);
				}
				else if (level < prev_level) {
					new_line = repeat('</li></ul>', prev_level - level) +
						'</li><li>';
				}
				new_line += '•&nbsp;<a href=\'' + link + '\'>' + title +
					'</a>';

				toc_list_html += new_line;
			});

		toc_list_html += repeat('</li></ul>', level - base_level) +
			'</li>' +
			'<li>•&nbsp;<a href="#post_comments_block">Comments</a></li>' +
			'</ul>';

		$(targetID).append(toc_list_html);

		$(targetID + 'ul.toc_list li a').click(function (e) {
			e.preventDefault();

			var href = $(event.target).attr('href');

			if (!href) {
				return;
			}

			AOIKSSS.util.scroll_to_hash(href);
		});
	}

	AOIKSSS.vue_app = new Vue({
		el: '#vue_app',
		data: {
			comment_infos: [],
			comment_ids: [],
			commenter_name: '',
			replyto_comment_id: 0,
			comment_content: ''
		},
		methods: {
			comment_reply_button_on_click: function (event) {
				var comment_id = Number(
					$(event.target).attr('data-comment-id'));

				this.replyto_comment_id = comment_id;
			},

			comment_submit_button_on_click: function () {
				AOIKSSS.post.add_comment();
			},

			post_toc_hide_link_on_click: function (event) {
				var hide_link = $(event.target);

				var post_toc_block = hide_link.parent();

				if (post_toc_block.hasClass('is_hidden')) {
					hide_link.html(hide_link.attr('data-shown-text'));
					post_toc_block.removeClass('is_hidden');
				}
				else {
					hide_link.html(hide_link.attr('data-hidden-text'));
					post_toc_block.addClass('is_hidden');
				}
			},

			back_to_top_button_on_click: function () {
				$('html, body').animate({
					scrollTop: 0
				}, 500, function () {
					window.location.hash = '';
				});
			}
		}
	});

	if (typeof window.toastr !== 'undefined') {
		var toastr = window.toastr;

		toastr.options.positionClass = 'toast-top-center';
		toastr.options.timeOut = 3000;
		toastr.options.extendedTimeOut = 5000;
	}

	if (typeof window.hljs !== 'undefined') {
		window.hljs.initHighlightingOnLoad();
	}

	init_post_toc('#post_toc_block');

	init_back_to_top_button('#back_to_top_block');

	AOIKSSS.post.get_comments($('#post_id').text().trim());
})(window);
