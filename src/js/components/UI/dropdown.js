// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.dropdown-toggle').forEach(button => {
        button.addEventListener('click', function (event) {
            // Prevent the click from propagating to the document
            event.stopPropagation();

            const menu = document.getElementById(this.getAttribute('aria-controls'));
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(m => {
                if (m !== menu) {
                    m.classList.remove('show');
                    m.previousElementSibling.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current dropdown
            this.setAttribute('aria-expanded', !isExpanded);
            menu.classList.toggle('show');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
                menu.previousElementSibling.setAttribute('aria-expanded', 'false');
            });
        }
    });
});
