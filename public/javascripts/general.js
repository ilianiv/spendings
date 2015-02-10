function DoPost(page, vals){
    //console.log(page + "|||" + vals);
    if (vals === undefined)
        vals = {};
    $.post(page, vals, function(){
        location.reload();
    });
}