
$(document).ready(function () {
    var item = localStorage.getItem('scale');
    var filter = localStorage.getItem('filter');
    var size = localStorage.getItem('size');
    
    if (size == null || size == '') {
        size = '1';
    }
    
    if (item == null || item == 0 || item == '') {
        item = 1;
    }

    document.getElementById('settings').value = item;
    document.getElementById('filter').value = filter;
    document.getElementById('size').value = size;
});

$('#settings').change(function () {
    localStorage.setItem('scale', document.getElementById('settings').value);
});

$('#filter').change(function () {
    localStorage.setItem('filter', document.getElementById('filter').value);
});

$('#size').change(function () {
    if (document.getElementById('size').value == '') {
        document.getElementById('size').value = '1';
    }
    localStorage.setItem('size', document.getElementById('size').value);
});