var app_uid = 'achgbcoajdgjpojafcpdlenfgjlbkdgm';
var on_controls_render = false;
var cloned_function = Wall._repliesLoaded;
Wall._repliesLoaded = function(post, hl, replies, names, data) {
    console.log('repliesLoaded');
    cloned_function(post, hl, replies, names, data);
    setTimeout(replace_html, 300);
}

window.onload = function () {replace_html()}

var rs_t = function(html, repl) {
  each (repl, function(k, v) {
    html = html.replace(new RegExp('%' + k + '%', 'g'), (typeof v === 'undefined' ? '' : v).toString().replace(/\$/g, '&#036;').replace(/\[(id[0-9]+)\|([^\]+]+)\]/,'<a href="/$1">$2</a>'));
  });
  return html;
}

var find_ancestor = function(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

var has_class = function(el, cls) {
    return el.classList.contains(cls);
}

var replace_html = function(){
    var reply_to_els = document.getElementsByClassName('reply_to');
    for (i = 0; i<reply_to_els.length; i++){
        var reply = find_ancestor(reply_to_els[i], 'reply');
        if (!hasClass(reply, 'o_yep') && !(hasClass(reply.firstChild, 'show_me_all'))){
            var reply_height = reply.offsetHeight;
            var oid = reply.getAttribute('id').split('-')[1].split('_')[0];
            var cid = reply.getAttribute('id').split('_')[1];
            var pid = find_ancestor(reply, 'post').getAttribute('id').split('_')[1];
            // var but = dojo.create("div", {class: 'show_me_all', cid: cid, pid: pid, oid:oid, style: but_size});
            var but = document.createElement('div');
            but.classList.add('show_me_all');
            but.setAttribute('oid', oid);
            but.setAttribute('cid', cid);
            but.setAttribute('pid', pid);
            but.setAttribute('style','height:' + (reply_height - 20) + 'px');
            reply.insertBefore(but, reply.firstChild);

            but.onclick = function() {
                draw_chain([this.getAttribute('cid'), this.getAttribute('pid'), this.getAttribute('oid')]);
            };
        };
    };
};

var pre_draw_controls = function(){
    if (document.getElementById('page_wall_posts') != null){
        replace_html();
    } else {
        setTimeout(pre_draw_controls, 100);
    }
}

var get_tpl = function(){
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
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </article>\
            <br clear="both">\
            </div>\
            '
    return html
}

var to_tpl = function(data, pid, persons){
    person = persons.filter(function(obj){
        return obj.id == data.from_id;
    });
    reply_info = {
        'reply_id': data.id,
        'date': data.date,
        'photo': person[0].photo_100,
        'text': data.text,
        'link': '/id'+ data.from_id,
        'reply_uid': pid,
        'name': person[0].first_name + ' ' + person[0].last_name,
        'to_link': '/id' + data.reply_to_user,
        'classname': '',
        'actions': '',
        'attr': ''

    };
    return reply_info;
}

var make_html = function(info, tpl){
    return se(rs_t(tpl, info));
}

var draw_box = function(html){
    var content = document.createElement('div');
    for (i=0; i<html.length; i++){
        content.appendChild(html[i]);
    };
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
    box.content(content.innerHTML);
    box.show();
    console.log('box.show');
}

var draw_chain = function(ids_list){
    var reply_html_list = [];
    chrome.runtime.sendMessage(app_uid, {'ids_list': ids_list}, function(result){
        template = get_tpl();
        for (i = 0; i<result.chain.length; i++){
            var info = to_tpl(result.chain[i], result.pid, result.persons);
            var pre_html = make_html(info, template);
            // var el = pre_html.getElementsByClassName('reply_footer')[0];
            // el.remove();
            reply_html_list[i] = pre_html;
        };
        draw_box(reply_html_list.reverse());
    });
}
