$(document).ready(function () {
    // Function to update the cart count in the header
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        $('#cart-count').text(itemCount);
    }

    // Function to display the cart items
    function displayCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        $('#cart-items').empty();

        if (cart.length === 0) {
            $('#cart-items').html('<p>Your cart is empty.</p>');
            updateCartCount();
            return;
        }

        let table = $('<table></table>');
        let header = `
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
            </tr>
        `;
        table.append(header);

        let grandTotal = 0;

        cart.forEach((item, index) => {
            let total = item.price * item.quantity;
            grandTotal += total;

            let row = `
                <tr>
                    <td><img src="${item.image}" alt="${item.name}" width="100"></td>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <button class="decrease-qty" data-index="${index}">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="increase-qty" data-index="${index}">+</button>
                    </td>
                    <td>$${total.toFixed(2)}</td>
                    <td><button class="remove-item" data-index="${index}">Remove</button></td>
                </tr>
            `;
            table.append(row);
        });

        let totalRow = `
            <tr>
                <td colspan="4" style="text-align: right;"><strong>Grand Total:</strong></td>
                <td colspan="3"><strong>$${grandTotal.toFixed(2)}</strong></td>
            </tr>
        `;
        table.append(totalRow);

        $('#cart-items').append(table);
        updateCartCount();
    }

    // Function to show the modal with a specific message
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
    }

    // Function to hide a specific modal
    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
    }

    // Event handler for increasing quantity
    $(document).on('click', '.increase-qty', function () {
        let index = $(this).data('index');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    });

    // Event handler for decreasing quantity
    $(document).on('click', '.decrease-qty', function () {
        let index = $(this).data('index');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
        } else {
            showModal('checkout-modal');
            // Store the index in a data attribute for confirmation
            $('#confirm-clear-cart').data('action', {
                type: 'remove',
                index: index
            });
        }
    });

    // Event handler for removing an item
    $(document).on('click', '.remove-item', function () {
        let index = $(this).data('index');
        showModal('custom-modal');
        // Store the index in a data attribute for confirmation
        $('#confirm-clear-cart').data('action', {
            type: 'remove',
            index: index
        });
    });

    // Event handler for clearing the cart
    $('#clear-cart').click(function () {
        showModal('custom-modal');
        // Store the action type in a data attribute for confirmation
        $('#confirm-clear-cart').data('action', {
            type: 'clear'
        });
    });

    // Event handler for confirming cart actions (remove or clear)
    $('#confirm-clear-cart').click(function () {
        let action = $(this).data('action');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (action.type === 'remove') {
            cart.splice(action.index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
        } else if (action.type === 'clear') {
            localStorage.removeItem('cart');
            displayCart();
        }

        hideModal('custom-modal');
    });

    // Event handler for canceling cart actions
    $('#cancel-clear-cart').click(function () {
        hideModal('custom-modal');
    });

    // Event handler for checkout button
    $('#checkout-cart').click(function () {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Your cart is empty. Add items before checking out.');
            return;
        }
        showModal('checkout-modal');
    });

    // Event handler for confirming checkout
    $('#confirm-checkout').click(function () {
        // Simulate checkout process
        localStorage.removeItem('cart');
        displayCart();
        hideModal('checkout-modal');
        showModal('success-modal');
    });

    // Event handler for canceling checkout
    $('#cancel-checkout').click(function () {
        hideModal('checkout-modal');
    });

    // Event handler for closing the success modal
    $('#close-success-modal').click(function () {
        hideModal('success-modal');
    });

    // Initial display of the cart
    displayCart();
});