document.addEventListener('DOMContentLoaded', function () {
    const selectElement = document.getElementById('selectOption');
    const form = document.getElementById('myForm');

    selectElement.addEventListener('change', function () {
        form.submit(); // Automatically submit the form when the select value changes
    });
});
