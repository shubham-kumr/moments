document.addEventListener('DOMContentLoaded', () => {
    const addMemoryBtn = document.getElementById('addMemoryBtn');
    const addMemoryModal = document.getElementById('addMemoryModal');
    const closeBtn = addMemoryModal.querySelector('.close');
    const addMemoryForm = document.getElementById('addMemoryForm');
    const userMenu = document.getElementById('userMenu');
    const dropdownMenu = userMenu.querySelector('.dropdown-menu');

    // Toggle dropdown menu
    userMenu.addEventListener('click', (e) => {
        dropdownMenu.classList.toggle('active');
        e.stopPropagation();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        dropdownMenu.classList.remove('active');
    });

    // Open modal
    addMemoryBtn.addEventListener('click', () => {
        addMemoryModal.style.display = 'block';
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        addMemoryModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addMemoryModal) {
            addMemoryModal.style.display = 'none';
        }
    });

    // Handle form submission
    addMemoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = addMemoryForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            const formData = new FormData(addMemoryForm);

            const response = await fetch('/memories/add', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                window.location.reload();
            } else {
                throw new Error(data.error || 'Failed to save memory');
            }
        } catch (error) {
            console.error('Error saving memory:', error);
            alert(error.message || 'Failed to save memory. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Memory';
        }
    });
}); 