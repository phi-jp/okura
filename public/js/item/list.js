tm.main(function() {

    tm.util.Ajax.load({
        url: '/api/item/list',
        dataType: 'json',
        success: onGetItemList
    });

});

var onGetItemList = function(res) {
    if (!res.success) {
        return;
    }
    var ul = tm.dom.Element('#list');
    res.data.forEach(function(item) {
        console.dir(item);

        var li = ul.create('li');
        var a = li.create('a');
        a.attr.set('href', '/item/' + item._id);
        a.text = item.title;

        if (item.kind === 0) {
            var img = a.create('img');
            img.attr.set('src', '/raw/' + item._id);
            img.height = 100;
        }
    });
};

