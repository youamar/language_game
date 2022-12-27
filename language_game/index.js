/**
 * Displays the descriptions of the available quiz
 */
function displayDescriptionsQuiz() {
    let id = "";
    let description = "";
    data.forEach(element => {
        id = element.id;
        description = element.description;
        $('.descriptions').append("<option value=" + id + ">" + description + "</option>");
    });
}

/**
 * Opens the new window with the given URL
 * @param {*String} src link of the page to be open 
 */
function openWindow(src) {
    window.location = src;
}

/**
 * Adapts the URL based on the id of the selection
 */
function CreateUrlId() {
    let selectedOption = $('.descriptions option:selected');
    let idVal = selectedOption.val();
    return idVal;
}