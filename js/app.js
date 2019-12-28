'use strict';

let options = [];
let gallery = [];
const myTemplate = Handlebars.compile($('#photo-template').html());
let page = 'data/page-1.json';

function Horn(img_url, title, description, keyword, horn) {
    this.img_url = img_url;
    this.title = title;
    this.description = description;
    this.keyword = keyword;
    this.horn = horn;
}

Horn.prototype.renderWithHandlebars = function () {
    const myHtml = myTemplate(this);
    $('#photos').append(myHtml);
}

Horn.prototype.renderOptions = function () {
    if (!options.includes(this.keyword)) {
        options.push(this.keyword);
        $('#keywords').append(`
        <option value=${this.keyword} > ${this.keyword}</option>
        `);
    }
}

function renderPage() {
    $.get(page, 'json').then(
        (data) => {
            data.forEach(objFromJsonFile => {
                let horn = new Horn(objFromJsonFile.image_url, objFromJsonFile.title, objFromJsonFile.description, objFromJsonFile.keyword, objFromJsonFile.horns);
                horn.renderWithHandlebars();
                horn.renderOptions();
                gallery.push(horn);
            });
            $('div').show();
            $(`div:first-child`).hide();
        });
}

//Display images of selected keyword only
$('#keywords').on('change', function () {
    let selectedItem = $('option:selected').val();
    if (selectedItem !== 'default') {
        $('div').hide();
        $(`div[class = "${selectedItem}"]`).show();
    } else {
        $('div').show();
    }
});

//dispay different pages when clicked on next page
$('#changePageBtn').click(function () {
    $('div').remove();
    if (page === 'data/page-1.json') {
        gallery = [];
        page = 'data/page-2.json';
    } else{
        gallery = [];
        page = 'data/page-1.json';
    }
    renderPage();
})


$('#sortByHornBtn').on('click', function(){
    sortByHorn();
});

$('#sortByTitleBtn').on('click', function(){
    sortByTitle();
})

function sortByHorn() {
    gallery.sort(function(a, b){
        if(a.horn > b.horn) return 1;
        if(b.horn > a.horn) return -1;
        return 0;
    });
    $('div').remove();
    gallery.forEach(element => element.renderWithHandlebars());
}

function sortByTitle(){
    gallery.sort(function(a, b){
        if(a.title > b.title) return 1;
        if(b.title > a.title) return -1;
        return 0;
    });
    $('div').remove();
    gallery.forEach(element => element.renderWithHandlebars());
}

renderPage()

