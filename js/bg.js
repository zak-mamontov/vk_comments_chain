chrome.extension.onMessageExternal.addListener(function(request, sender, call_back){
    chain = create_chaine(request.ids_list);
    call_back({'chain':chain[0], 'pid':request.ids_list[1], 'persons':chain[1]});
})

var create_chaine = function(ids_list){
    var data = {
        'owner_id' : '-' + ids_list[2],
        'post_id' : ids_list[1],
        'count' : 100,
        'sort' : 'desc',
        'v' : 5.33,
        'start_comment_id' : ids_list[0],
        'extended': 1,
    };
    var url = 'https://api.vk.com/method/wall.getComments?';
    var resp = send_api_request(data, url, false);
    var full_json = JSON.parse(resp).response;
    var persons = full_json.profiles;
    var next_id = full_json.items[0].reply_to_comment;
    var chain = [full_json.items[0],];
    var num_of_comments = (full_json.count - full_json.real_offset > 100) ? 100 : (full_json.count - full_json.real_offset);
    for (i = 1; i< num_of_comments; i++){
        console.log(i);
        if (full_json.items[i].id == next_id){
            chain.push(full_json.items[i]);

            if (full_json.items[i].reply_to_comment != undefined){
                next_id = full_json.items[i].reply_to_comment;
            } else {
                return [chain, persons]
            }
        };
    };
    return [chain, persons];
}

var dict_to_uri = function(dict){
    return Object.keys(dict).map(function(key){ 
        return encodeURIComponent(key) + '=' + encodeURIComponent(dict[key]); 
    }).join('&');
}

var send_api_request = function(data, url, sync){
    var req = new XMLHttpRequest();
    req.open('GET', url + dict_to_uri(data), sync);
    req.send();
    return req.responseText;
}

