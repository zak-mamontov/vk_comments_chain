chrome.extension.onMessageExternal.addListener(function(request, sender, call_back){
    chain = create_chaine(request.oid, request.pid, request.cid);
    call_back(chain);
})


create_chaine = function(owner_id, post_id, comment_id){
    resp = send_api_request(owner_id, post_id, comment_id);
    console.log(resp)
    full_json = JSON.parse(resp).response;
    console.log(full_json);
    var next_id = full_json.items[0].reply_to_comment;
    var chain = [full_json.items[0],];
    num_of_comments = full_json.count - full_json.real_offset - 1;
    for (i = 1; i< num_of_comments; i++){
        if (full_json.items[i].id = next_id){
            chain.push(full_json.items[i]);
            next_id = full_json.items[i].reply_to_comment;
        };
    };
    return chain;
}


dict_to_uri = function(dict){
    return Object.keys(dict).map(function(key){ 
        return encodeURIComponent(key) + '=' + encodeURIComponent(dict[key]); 
    }).join('&');
}

send_api_request = function(owner_id, post_id, comment_id){
    data = {
        'owner_id' : '-' + owner_id,
        'post_id' : post_id,
        'count' : 100,
        'sort' : 'desc',
        'v' : 5.33,
        'start_comment_id' : comment_id,
    };
    var req = new XMLHttpRequest();
    // req.addEventListener('load', request_listener, false);
    req.open('GET', 'https://api.vk.com/method/wall.getComments?' + dict_to_uri(data), false);
    req.send();
    return req.responseText;
}

