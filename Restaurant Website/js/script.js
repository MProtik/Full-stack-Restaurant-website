// Select the menu icon and navbar from the HTML
let menu = document.querySelector('#menu-bars');
let navbar = document.querySelector('.navbar');

// When the menu icon is clicked, toggle between 'fa-times' class and show/hide navbar
menu.onclick = () =>{
  menu.classList.toggle('fa-times'); // This changes the icon (like hamburger to X)
  navbar.classList.toggle('active'); // This shows or hides the navbar
}

// Grab all sections and all navigation links in the navbar
let section = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header .navbar a');

// When the user scrolls the page
window.onscroll = () =>{

  // Close the navbar if it's open (remove active and icon class)
  menu.classList.remove('fa-times');
  navbar.classList.remove('active');

  // For every section on the page
  section.forEach(sec =>{

    let top = window.scrollY; // How far we've scrolled from the top
    let height = sec.offsetHeight; // The height of the current section
    let offset = sec.offsetTop - 150; // Start tracking a bit before the section
    let id = sec.getAttribute('id'); // Get the ID of the section (like 'home', 'about')

    // If we're currently inside this section while scrolling
    if(top >= offset && top < offset + height){
      // Remove 'active' class from all nav links
      navLinks.forEach(links =>{
        links.classList.remove('active');

        // Add 'active' class to the nav link that points to this section
        document.querySelector('header .navbar a[href*='+id+']').classList.add('active');
      });
    };

  });

}

// When the search icon is clicked, show or hide the search form
document.querySelector('#search-icon').onclick = () =>{
  document.querySelector('#search-form').classList.toggle('active');
}

// When the close button on the search form is clicked, hide the search form
document.querySelector('#close').onclick = () =>{
  document.querySelector('#search-form').classList.remove('active');
}

// Create a new Swiper slider for the homepage
var swiper = new Swiper(".home-slider", {
  spaceBetween: 30, // space between slides
  centeredSlides: true, // slides will be centered
  autoplay: {
    delay: 7500, // 7.5 seconds delay between slides
    disableOnInteraction: false, // keep autoplaying even after user swipes
  },
  pagination: {
    el: ".swiper-pagination", // show pagination dots
    clickable: true, // make the dots clickable
  },
  loop:true, // loop back to the beginning when finished
});

// Another Swiper slider, this one for reviews
var swiper = new Swiper(".review-slider", {
  spaceBetween: 20,
  centeredSlides: true,
  autoplay: {
    delay: 7500,
    disableOnInteraction: false,
  },
  loop:true,
  // Different number of slides per view depending on screen size
  breakpoints: {
    0: {
        slidesPerView: 1,
    },
    640: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// Function to fade out the loader (probably a loading screen)
function loader(){
  document.querySelector('.loader-container').classList.add('fade-out');
}

// Start fading out the loader after 3 seconds
function fadeOut(){
  setInterval(loader, 3000);
}

// When the page finishes loading, start the fade out
window.onload = fadeOut;

// Add to Cart button with quantity selection
let addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

addToCartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault(); // prevent default link behavior

        // Get the selected quantity
        let quantitySelect = btn.previousElementSibling;
        let quantity = parseInt(quantitySelect.value);

        // Get product name and price
        let productBox = btn.closest('.box');
        let productName = productBox.querySelector('h3').innerText;
        let productPrice = productBox.querySelector('span').innerText;

        console.log(`Adding ${quantity} x ${productName} (${productPrice}) to cart`);

        // TODO: replace console.log with your actual add-to-cart logic
        // Example: addToCart(productName, quantity, productPrice);
    });
});

// Cart array to keep track of items
let cart = [];

// Add item to cart
function addToCart(itemName, quantity) {
    // Check if item already exists
    let existing = cart.find(i => i.name === itemName);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({name: itemName, quantity: quantity});
    }

    updateOrderForm();
}

// Update the "Order Now" form inputs
function updateOrderForm() {
    const foodInput = document.querySelector('input[name="food_name"]');
    const qtyInput = document.querySelector('input[name="quantity"]');

    if (cart.length === 0) {
        foodInput.value = '';
        qtyInput.value = '';
        return;
    }

    // Prepare strings like: "Pizza, Burger"
    let foodNames = cart.map(i => i.name).join(', ');
    let quantities = cart.map(i => `${i.quantity}x${i.name}`).join(', ');

    foodInput.value = foodNames;
    qtyInput.value = quantities;
}

// Attach event listeners to all add-to-cart buttons
document.querySelectorAll('.box').forEach(box => {
    const addBtn = box.querySelector('.btn');
    const select = box.querySelector('select');
    const itemName = box.querySelector('h3').textContent;

    addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const qty = parseInt(select.value);
        if (qty > 0) {
            addToCart(itemName, qty);
            select.value = 1; // reset select to 1
        }
    });
});

// Select all quantity dropdowns
document.addEventListener('DOMContentLoaded', () => {

    // Maximum quantity you want
    const maxQuantity = 20;

    // Populate all quantity dropdowns dynamically
    const quantitySelects = document.querySelectorAll('.quantity-select');
    quantitySelects.forEach(select => {
        for (let i = 1; i <= maxQuantity; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            select.appendChild(option);
        }
    });

    // Cart functionality
    let cart = [];

    function addToCart(name, quantity) {
        cart.push({ name, quantity });
        updateOrderForm();
    }

    function updateOrderForm() {
        const foodInput = document.querySelector('input[name="food_name"]');
        const qtyInput = document.querySelector('input[name="quantity"]');

        if (cart.length === 0) {
            foodInput.value = '';
            qtyInput.value = '';
            return;
        }

        const foodNames = cart.map(i => i.name).join(', ');
        const quantities = cart.map(i => `${i.quantity}x${i.name}`).join(', ');

        foodInput.value = foodNames;
        qtyInput.value = quantities;
    }

    // Attach event listeners to all add-to-cart buttons
    document.querySelectorAll('.box').forEach(box => {
        const addBtn = box.querySelector('.add-to-cart-btn');
        const select = box.querySelector('.quantity-select');
        const itemName = box.querySelector('h3').textContent;

        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const qty = parseInt(select.value);
            if (qty > 0) {
                addToCart(itemName, qty);
                select.value = 1; // reset select to 1
            }
        });
    });

});

const orderForm = document.getElementById('orderBtn');
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');
const modalMessage = document.getElementById('modalMessage');

orderForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // stop normal form submission

    const formData = new FormData(orderForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(orderForm.action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            // Show success message in modal
            modalMessage.textContent = result.message || "Thank you for ordering!";
            successModal.style.display = 'block';
            orderForm.reset(); // clear the form
            cart = []; // clear cart if you want
        } else {
            modalMessage.textContent = "Something went wrong. Please try again.";
            successModal.style.display = 'block';
        }
    } catch (err) {
        modalMessage.textContent = "Network error. Please try again.";
        successModal.style.display = 'block';
        console.error(err);
    }
});

// Close modal when clicking on the close button
closeModal.onclick = () => {
    successModal.style.display = 'none';
}

// Optional: close modal when clicking outside the modal content
window.onclick = (event) => {
    if (event.target == successModal) {
        successModal.style.display = 'none';
    }
}

const form = document.getElementById("orderForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("http://localhost:8000/submit-order/", {
            method: "POST",
            body: new URLSearchParams(data)
        });

        const result = await response.json();

        if(result.status === "success") {
            alert(result.message); // Shows "Your order has been confirmed!"
            form.reset(); // Clear form after confirmation
        } else {
            alert("Error: " + result.message);
        }
    } catch(err) {
        alert("Something went wrong!");
        console.error(err);
    }
});




