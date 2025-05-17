document.addEventListener('DOMContentLoaded', function() {
    // Переменные
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartSection = document.querySelector('.cart-section');
    const cartItems = document.querySelector('.cart-items');
    const emptyCart = document.querySelector('.empty-cart');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutButton = document.querySelector('.checkout-button');
    const orderButton = document.querySelector('.order-button');
    const readMoreButton = document.querySelector('.read-more');
    
    // Массив для хранения товаров в корзине
    let cart = [];
    
    // Мобильное меню
    hamburger.addEventListener('click', function() {
        menu.classList.toggle('active');
    });
    
    // Плавная прокрутка до секций
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Закрываем мобильное меню после клика
            menu.classList.remove('active');
        });
    });
    
    // Добавление товаров в корзину
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.pizza-card');
            const name = card.querySelector('h3').textContent;
            const price = parseInt(card.querySelector('.price').textContent);
            
            addToCart(name, price);
            showNotification(`"${name}" добавлена в корзину!`);
        });
    });
    
    // Переход к меню при нажатии на кнопку "Заказать сейчас"
    orderButton.addEventListener('click', function() {
        const menuSection = document.querySelector('#menu');
        window.scrollTo({
            top: menuSection.offsetTop - 70,
            behavior: 'smooth'
        });
    });
    
    // Анимация историй при нажатии на "Узнать больше"
    readMoreButton.addEventListener('click', function() {
        alert('Виталик начал свой бизнес после того, как приготовил пиццу на спор с друзьями. Они сказали, что его пицца - это шутка. Теперь это шутка, на которой он зарабатывает миллионы!');
    });
    
    // Функция добавления товара в корзину
    function addToCart(name, price) {
        // Проверяем, есть ли товар уже в корзине
        const existingItemIndex = cart.findIndex(item => item.name === name);
        
        if (existingItemIndex > -1) {
            // Если товар уже в корзине, увеличиваем количество
            cart[existingItemIndex].quantity++;
        } else {
            // Иначе добавляем новый товар
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }
        
        // Обновляем корзину
        updateCartDisplay();
    }
    
    // Функция обновления корзины
    function updateCartDisplay() {
        if (cart.length === 0) {
            emptyCart.style.display = 'block';
        } else {
            emptyCart.style.display = 'none';
            
            // Очищаем содержимое корзины перед обновлением
            let cartHTML = '';
            let totalPrice = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;
                
                cartHTML += `
                    <div class="cart-item">
                        <div class="cart-item-details">
                            <h3>${item.name}</h3>
                            <p>${item.price} ₽ x ${item.quantity}</p>
                        </div>
                        <div class="cart-item-actions">
                            <button class="remove-item" data-name="${item.name}">Удалить</button>
                        </div>
                    </div>
                `;
            });
            
            cartItems.innerHTML = cartHTML;
            totalPriceElement.textContent = totalPrice;
            
            // Добавляем слушатели для кнопок удаления
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const name = this.getAttribute('data-name');
                    removeFromCart(name);
                });
            });
        }
    }
    
    // Функция удаления товара из корзины
    function removeFromCart(name) {
        const itemIndex = cart.findIndex(item => item.name === name);
        
        if (itemIndex > -1) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity--;
            } else {
                cart.splice(itemIndex, 1);
            }
            
            updateCartDisplay();
        }
    }
    
    // Кнопка оформления заказа
    checkoutButton.addEventListener('click', function() {
        if (cart.length > 0) {
            alert('Спасибо за заказ! Виталик уже бежит печь вашу пиццу!');
            cart = [];
            updateCartDisplay();
        }
    });
    
    // Функция показа уведомления
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Стили для уведомления
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--primary-color)';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'opacity 0.3s, transform 0.3s';
        
        // Показываем уведомление
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Скрываем через 3 секунды
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            // Удаляем элемент после анимации
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Анимация появления элементов при скролле
    window.addEventListener('scroll', function() {
        const elements = document.querySelectorAll('.pizza-card, .about-content');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Инициализация начальных стилей для анимации
    document.querySelectorAll('.pizza-card, .about-content').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s, transform 0.5s';
    });
});