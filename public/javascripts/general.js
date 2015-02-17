function DoPost(page, vals){
    bootbox.confirm("Are you sure?", function(result) {
        if (result){
            //console.log(page + "|||" + vals);
            if (vals === undefined)
                vals = {};
            $.post(page, vals, function(){
                location.reload();
            });
        }
    });
}