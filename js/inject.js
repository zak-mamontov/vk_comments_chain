app_uid = 'achgbcoajdgjpojafcpdlenfgjlbkdgm';


function rs_t(html, repl) {
  each (repl, function(k, v) {
    html = html.replace(new RegExp('%' + k + '%', 'g'), (typeof v === 'undefined' ? '' : v)
      .toString().replace(/\$/g, '&#036;'));
  });
  return html;
}

replace_html = function(){
    el_list = document. getElementsByClassName('reply_content');
    for (i = 0; i< el_list.length; i++){
        if (el_list[i].getElementsByClassName('reply_to').length != 0){
            var node = document.createElement('span');
            var link = el_list[i].getElementsByClassName('wd_lnk')[0].href;
            var cid = link.split('?reply=')[1];
            var pid = link.split('?reply=')[0].split('_')[1];
            var oid = link.split('-')[1].split('_')[0];
            node.textContent = 'Comments chain';
            node.className = 'show_chain';
            node.onclick = function() {
                draw_chain(pid, cid, oid);
            };
            el_list[i].getElementsByClassName('reply_author')[0].appendChild(node);
        };
    };
    var a = 'wrap">';
    var b = '<h1>Тест</h1>';
    cur.wallTpl.reply_actions = cur.wallTpl.reply_actions.replace(a, a+b);
};

pre_draw_controls = function(){
    if (document.getElementsByClassName('reply_author').length != 0){
        replace_html();
    } else {
        setTimeout(draw_controls, 100);
    }
}
    

get_tpl = function(){
    tpl = cur.wallTpl.reply;
    return tpl;
}

to_tpl = function(data, pid){
    console.log('to_tpl:start');
    reply_info = {
        'reply_id': data.id,
        'date': data.date,
        'photo': '',
        'text': data.text,
        'link': '/id'+ data.from_id,
        'reply_uid': pid,
        'name': '',
        'to_link': '/id' + data.reply_to_user,
        'classname': '',
        'actions': '',

    };
    return reply_info;
}

make_html = function(info, tpl){
    return se(rs_t(tpl, info));
}

draw_box = function(html){
    var box = new MessageBox({});
    for (i=0; i<html.length; i++){
        box.bodyNode.appendChild(html[i]);
    };
    box.show();
}

draw_chain = function(pid, cid, oid){
    var reply_html_list = [];
    chrome.runtime.sendMessage(app_uid, {'pid': pid, 'cid': cid, 'oid':oid}, function(result){
        console.log('draw_chain|result:', result);
        template = get_tpl();
        for (i = 0; i<result.chain.length-1; i++){
            var info = to_tpl(result.chain[i], result,pid);
            var pre_html = make_html(info, template);
            var el = pre_html.getElementsByClassName('reply_footer')[0];
            el.remove();
            reply_html_list[i] = pre_html;
        };
        draw_box(reply_html_list);
    })
    
}

setTimeout(pre_draw_controls, 1000);

