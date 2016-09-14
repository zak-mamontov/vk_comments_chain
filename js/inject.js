var app_debug = false;
var update_time = 2000;
var app_uid = '';
var on_controls_render = false;
var bg_image;
var wall_overloaded = false;
var obj_loc;
var replies_length = 0;

var console_log = function(s) {
    if (app_debug) {
        if (Array.isArray(s)) {
            s = s.join(' ');
        }
        console.log(s);
    }
}

document.addEventListener('BindDefData', function(e) {
    bg_image = e.detail.url;
    app_uid = e.detail.app_uid;
})

window.onload = function() { update_loc(); };


var rs_t = function(html, repl) {
    each(repl, function(k, v) {
        if (k == 'text') {
            v = (typeof v === 'undefined' ? '' : v);
            v = v.replace(/(\r|\n)/g, ' <br /> '); // make newlines
            v = v.replace(/((http)?s?(\:\/\/)?((www)?\.?[a-zA-Z0-9]+\.[a-zA-Z]+\/?\S+))/g, '<a href="$1" target="_blank">$4</a>'); //make links
            v = v.replace(/_blank">([^<]{25})([^<]*)/g, '/_blank">$1..'); // long links shall be shorter
        };
        html = html.replace(new RegExp('%' + k + '%', 'g'), (typeof v === 'undefined' ? '' : v).toString().replace(/\$/g, '&#036;'));
    });
    html = html.replace(/\[(id[0-9]+)\|([^\]+]+)\]/, '<a href="/$1">$2</a>'); // [id|name] -> <a href="/id">name</a>
    return html;
}

var update_loc = function() {
    console_log('update_loc|start')
    if (typeof(nav.objLoc) != 'undefined' && obj_loc != nav.objLoc) {
        console_log('update_loc|nav.objLoc');
        obj_loc = nav.objLoc;
        replace_html();
    } else if (document.getElementsByClassName('reply_to').length != replies_length) {
        console_log(['update_loc|replies_length', replies_length]);
        replace_html();
    };
    setTimeout(update_loc, update_time);
}

var find_ancestor = function(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

var has_class = function(el, cls) {
    return el.classList.contains(cls);
}

var replace_html = function() {
    console_log('replace_html|start')
    if (typeof(Wall) != 'undefined' && !wall_overloaded) {
        var cloned_function = Wall._repliesLoaded;
        Wall._repliesLoaded = function(post, hl, replies, names, data) {
            cloned_function(post, hl, replies, names, data);
            wall_overloaded = true;
            setTimeout(replace_html, 300);
        };
    };
    var reply_to_els = document.getElementsByClassName('reply_to');
    for (i = 0; i < reply_to_els.length; i++) {
        console_log('replace_html|loop start');
        var reply = find_ancestor(reply_to_els[i], 'reply');
        if (!hasClass(reply, 'o_yep') && !(hasClass(reply.firstChild, 'show_me_all'))) {
            console_log('replace_html|loop if');
            var reply_height = reply.offsetHeight;
            var summ_id = reply.getAttribute('id').replace(/[a-z]+\-?([0-9]+)_([0-9]+)/, '$1!$2')
            var oid = summ_id.split('!')[0]
            var cid = summ_id.split('!')[1]
            var pid = find_ancestor(reply, 'post').getAttribute('id').split('_')[1];
            var but = document.createElement('div');
            but.classList.add('show_me_all');
            but.setAttribute('oid', oid);
            but.setAttribute('cid', cid);
            but.setAttribute('pid', pid);
            but.setAttribute('style', 'height:' + (reply_height - 20) + 'px');
            reply.insertBefore(but, reply.firstChild);
            but.onclick = function() {
                draw_chain([this.getAttribute('cid'), this.getAttribute('pid'), this.getAttribute('oid')]);
            };
        };
    };
    replies_length = reply_to_els.length;
};

var pre_draw_controls = function() {
    if (document.getElementById('page_wall_posts') != null) {
        replace_html();
    } else {
        setTimeout(pre_draw_controls, 100);
    }
}

var get_tpl = function() {
    html = '<div class="comment_overlay" style="display: block;">\
                <article id="ARTICLE_1">\
                <div id="DIV_2">\
                    <div id="DIV_3">\
                        <div id="DIV_4">\
                            <a href="%link%" id="A_5"><img src="%photo%" id="IMG_6" /><span id="SPAN_7"></span></a>\
                        </div>\
                        <div id="DIV_8">\
                            <h1 id="H1_9">\
                                 <a href="%link%" id="A_10">%name%</a>\
                            </h1>\
                            <div id="DIV_11">\
                                <p id="P_12">\
                                    %text%\
                                </p>\
                            '
    return html
}

var get_photos = function(data) {
    var photos = [];
    if (typeof(data.attachments) != 'undefined') {
        for (var i = 0; i < data.attachments.length; i++) {
            if (data.attachments[i].type == 'photo') {
                var photo_size = 0;
                for (var k = 0; k < Object.keys(data.attachments[i].photo).length; k++) {
                    var act_size = parseInt(Object.keys(data.attachments[i].photo)[k].replace(/photo_([0-9]+)/, '$1'));
                    if (photo_size < act_size) {
                        photo_size = act_size;
                    };
                };
                photos.push(data.attachments[i].photo['photo_' + photo_size]);
            };
        };
    };
    return photos;
}

var to_tpl = function(data, pid, persons) {
    person = persons.filter(function(obj) {
        return obj.id == Math.abs(data.from_id);
    });
    reply_info = {
        'reply_id': data.id,
        'date': data.date,
        'photo': person[0].photo_100,
        'text': data.text,
        'link': '/id' + data.from_id,
        'reply_uid': pid,
        'name': person[0].first_name + ' ' + person[0].last_name,
        'to_link': '/id' + data.reply_to_user,
        'classname': '',
        'actions': '',
        'attr': ''

    };
    return reply_info;
}

var make_html = function(info, tpl, photos) {
    var result = rs_t(tpl, info);
    if (photos.length > 0) {
        for (var i = 0; i < photos.length; i++) {
            result += '<a href=' + photos[i] + ' target="_blank"><img src=' + photos[i] + ' class="in_image"/></a>';
        };

    };
    result += '</div>\
                        </div>\
                    </div>\
                </div>\
            </article>\
            <br clear="both">\
            </div>\
            '

    return result;
}

var draw_box = function(html) {
    var box = new MessageBox({
        title: false,
        width: 670,
        onHide: false,
        onDestroy: false,
        bodyStyle: 'background-color: rgba(79, 113, 152, 0.3); border-radius: 6px',
        hideButtons: true,
        grey: true,
        progress: true,
        hideOnBGClick: false
    });
    box.content(html);
    box.show();
    return box;
}

var draw_chain = function(ids_list) {
    box = draw_box('<div id="preload" style="background-image: url(' + bg_image + ')"></div>')
    var cont = '';
    chrome.runtime.sendMessage(app_uid, { 'ids_list': ids_list }, function(result) {
        template = get_tpl();
        for (i = 0; i < result.chain.length; i++) {
            var info = to_tpl(result.chain[i], result.pid, result.persons);
            var photos = get_photos(result.chain[i]);
            var pre_html = make_html(info, template, photos);
            cont = pre_html + cont;
        };
        box.content(cont);
    });
}
