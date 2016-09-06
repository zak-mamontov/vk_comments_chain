var app_uid = 'achgbcoajdgjpojafcpdlenfgjlbkdgm',
    id_list = []

var cloned_function = Wall._repliesLoaded;
Wall._repliesLoaded = function(post, hl, replies, names, data) {
    cloned_function(post, hl, replies, names, data);
    setTimeout(replace_html, 300);
}

rs_t = function(html, repl) {
  each (repl, function(k, v) {
    html = html.replace(new RegExp('%' + k + '%', 'g'), (typeof v === 'undefined' ? '' : v).toString().replace(/\$/g, '&#036;'));
  });
  return html;
}

replace_html = function(){
    require(['dojo/on', 'dojo/query', 'dojo/dom', "dojo/NodeList-traverse"], function(on, query, dom, domClass){
        query('.reply_to').forEach(function(node){
            if (!hasClass(query(node).closest(".reply")), 'o_yep'){
                var reply = query(node).closest(".reply").addClass("o_yep")[0];
                var reply_box = dojo.position(reply);
                var but_size = {height: reply_box.h -20 + 'px'}
                var oid = reply.id.split('-')[1].split('_')[0];
                var pid = query('#'+reply.id+' .wd_lnk')[0].getAttribute('href').split('_')[1].split('?')[0];
                var cid = reply.id.split('_')[1];
                var but = dojo.create("div", {class: 'show_me_all', cid: cid, pid: pid, oid:oid, style: but_size});

                dojo.place(but, reply, "first");
            }
        })
        query('.show_me_all').on('click', function(){
            draw_chain([this.getAttribute('cid'), this.getAttribute('pid'), this.getAttribute('oid')]);
        });
    })
};

pre_draw_controls = function(){
    if (document.getElementById('page_wall_posts') != null){
        replace_html();
    } else {
        setTimeout(pre_draw_controls, 100);
    }
}
    

// get_tpl = function(){
//     tpl = cur.wallTpl.reply.replace('reply_img','reply_img own_ava');
//     return tpl;
// }

get_tpl = function(){
    html = '<div class="comment_overlay" style="display: block;">\
    <article class="layout-row retrievable clearfix">\
        <div class="col-xs-12 odd lovemark-comment xs-no-padding">\
        <div clas<article id="ARTICLE_1">\
    <div id="DIV_2">\
        <div id="DIV_3">\
            <div id="DIV_4">\
                <a href="%link" id="A_5"><img src="%photo%" id="IMG_6" /><span id="SPAN_7"></span></a>\
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

to_tpl = function(data, pid, persons){
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

make_html = function(info, tpl){
    return se(rs_t(tpl, info));
}

draw_box = function(html){
    var content = document.createElement('div');
    for (i=0; i<html.length; i++){
        content.appendChild(html[i]);
    };
    var box = new MessageBox({
                title: false,
                width: 670,
                onHide: false,
                onDestroy: false,
                bodyStyle: 'background-color: rgba(241, 240, 240, 0.84); border-radius: 8px',
                hideButtons: true,
                grey: true
            });
    box.content(content.innerHTML);
    box.show();
}

draw_chain = function(ids_list){
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
    })
    
}

setTimeout(pre_draw_controls, 1000);

