request_listener = function(){
    full_json = JSON.parse(this.responseText).response;
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
    console.log(chain);
}


dict_to_uri = function(dict){
    return Object.keys(dict).map(function(key){ 
        return encodeURIComponent(key) + '=' + encodeURIComponent(dict[key]); 
    }).join('&');
}

send_api_request = function(owner_id, post_id, comment_id){
    data = {
        'owner_id' : -1*owner_id,
        'post_id' : post_id,
        'count' : 100,
        'sort' : 'desc',
        'v' : 5.33,
        'start_comment_id' : comment_id,
    };
    var req = new XMLHttpRequest();
    req.addEventListener('load', request_listener);
    req.open('GET', 'https://api.vk.com/method/wall.getComments?' + dict_to_uri(data));
    req.send();
}

send_api_request(116747264, 96, 146);