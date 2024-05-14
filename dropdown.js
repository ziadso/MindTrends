document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');

    // Function to close all dropdowns
    function closeAllDropdowns() {
        dropdownMenus.forEach(menu => {
            menu.classList.add('hidden');
        });
    }

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(event) {
            event.stopPropagation();

            closeAllDropdowns();

            const dropdownMenu = this.nextElementSibling;
            dropdownMenu.classList.toggle('hidden');
        });
    });

    document.addEventListener('click', function() {
        closeAllDropdowns();
    });
});