var app_uid = 'achgbcoajdgjpojafcpdlenfgjlbkdgm';

replace_html = function(){
    el_list = document. getElementsByClassName('reply_content');
    for (i = 0; i< el_list.length; i++){
        if (el_list[i].getElementsByClassName('reply_to').length != 0){
            var node = document.createElement('span');
            var link = el_list[i].getElementsByClassName('wd_lnk')[0].href;
            console.log(link)
            var cid = link.split('?reply=')[1];
            var pid = link.split('?reply=')[0].split('_')[1];
            var oid = link.split('-')[1].split('_')[0];
            console.log(pid, cid)
            node.textContent = 'Comments chain';
            node.className = 'show_chain';
            
            node.onclick = function() {
                draw_chain(pid, cid, oid);
            };
            el_list[i].getElementsByClassName('reply_author')[0].appendChild(node);
        };
    };
    a = 'wrap">';
    b = '<h1>Тест</h1>';
    cur.wallTpl.reply_actions = cur.wallTpl.reply_actions.replace(a, a+b);
};

pre_draw_controls = function(){
    if (document.getElementsByClassName('reply_author').length != 0){
        replace_html();
    } else {
        setTimeout(draw_controls, 100);
    }
}
    
sendResponse =  function(response){
    console.log(response);
};

draw_chain = function(pid, cid, oid){
    chrome.runtime.sendMessage(app_uid, {'pid': pid, 'cid': cid, 'oid':oid}, function(result){
        console.log(result);
    });
}

setTimeout(pre_draw_controls, 1000);
