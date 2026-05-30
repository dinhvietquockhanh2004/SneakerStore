let productsData = [];
let cart = [];
let currentSelectedSize = null;
let activeModalProduct = null;
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    fetchProducts();
    setupSearch();
    initAuth();

    document.addEventListener('click', (e) => {
        const wrap = document.getElementById('userAvatarWrap');
        if (wrap && !wrap.contains(e.target)) {
            document.getElementById('userDropdown').classList.remove('open');
        }
    });
});

function initCursor() {
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const clickables = document.querySelectorAll('a, button, .product-card, .brand-item');
    clickables.forEach(item => {
        item.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(2.5)');
        item.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
    });
}

function fetchProducts() {
    productsData = [
        {
            "id": 1,
            "name": "Nike Air Max Pulse",
            "brand": "Nike",
            "price": 150,
            "oldPrice": 180,
            "badge": "SALE",
            "badgeClass": "sale-badge",
            "rating": 4.8,
            "reviews": 124,
            "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
            "sizes": [39, 40, 41, 42, 43],
            "desc": "Được trang bị hệ thống đệm Air thế hệ mới, Nike Air Max Pulse mang lại cảm giác êm ái vượt trội cùng thiết kế đậm chất đường phố."
        },
        {
            "id": 2,
            "name": "Adidas Ultraboost Light",
            "brand": "Adidas",
            "price": 190,
            "badge": "NEW",
            "badgeClass": "new-badge",
            "rating": 4.9,
            "reviews": 85,
            "image": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
            "sizes": [40, 41, 42, 43, 44],
            "desc": "Dòng sản phẩm chạy bộ huyền thoại với công nghệ đệm Boost nhẹ hơn 30%, tối ưu hóa khả năng hoàn trả năng lượng trên mỗi bước chạy."
        },
        {
            "id": 3,
            "name": "Puma RS-X Efekt Retro",
            "brand": "Puma",
            "price": 120,
            "oldPrice": 140,
            "badge": "TRENDING",
            "badgeClass": "sale-badge",
            "rating": 4.6,
            "reviews": 62,
            "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
            "sizes": [38, 39, 40, 41, 42],
            "desc": "Sự kết hợp hoàn hảo giữa phong cách tương lai và hơi hướng cổ điển, mang lại cá tính mạnh mẽ cho người mặc."
        },
        {
            "id": 4,
            "name": "Asics Gel-Kayano 30",
            "brand": "Asics",
            "price": 160,
            "rating": 4.7,
            "reviews": 95,
            "image": "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&auto=format&fit=crop&q=80",
            "sizes": [41, 42, 43, 44],
            "desc": "Công nghệ 4D Guidance System đem lại sự ổn định tuyệt đối và lớp đệm FF BLAST™ PLUS ECO cho trải nghiệm êm ái đỉnh cao."
        },
        {
            "id": 5,
            "name": "Nike Air Force 1 '07",
            "brand": "Nike",
            "price": 110,
            "badge": "CLASSIC",
            "badgeClass": "new-badge",
            "rating": 4.9,
            "reviews": 312,
            "image": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
            "sizes": [38, 39, 40, 41, 42, 43, 44],
            "desc": "Huyền thoại sống mãi với thời gian. Nike Air Force 1 '07 mang đế Air đệm êm ái, chất da cao cấp và thiết kế vĩnh cửu phù hợp mọi phong cách."
        },
        {
            "id": 6,
            "name": "Nike React Infinity Run",
            "brand": "Nike",
            "price": 175,
            "oldPrice": 200,
            "badge": "SALE",
            "badgeClass": "sale-badge",
            "rating": 4.7,
            "reviews": 88,
            "image": "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=80",
            "sizes": [40, 41, 42, 43, 44],
            "desc": "Được thiết kế để giảm thiểu chấn thương, Nike React Infinity Run tích hợp đế React êm ái và phần trên Flyknit thoáng khí cho mỗi bước chạy."
        },
        {
            "id": 7,
            "name": "Adidas Stan Smith",
            "brand": "Adidas",
            "price": 90,
            "badge": "ICON",
            "badgeClass": "new-badge",
            "rating": 4.8,
            "reviews": 521,
            "image": "https://images.unsplash.com/photo-1556906781-9a412961a28d?w=600&auto=format&fit=crop&q=80",
            "sizes": [38, 39, 40, 41, 42, 43],
            "desc": "Biểu tượng thời trang thể thao với hơn 50 năm lịch sử. Adidas Stan Smith sở hữu thiết kế thuần khiết, chất da mềm và logo 3 sọc kinh điển."
        },
        {
            "id": 8,
            "name": "Adidas NMD R1",
            "brand": "Adidas",
            "price": 145,
            "oldPrice": 165,
            "badge": "SALE",
            "badgeClass": "sale-badge",
            "rating": 4.6,
            "reviews": 143,
            "image": "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80",
            "sizes": [39, 40, 41, 42, 43, 44],
            "desc": "Phong cách đường phố táo bạo kết hợp công nghệ Boost tối tân và các khối EVA mang tính biểu tượng, NMD R1 là lựa chọn hoàn hảo cho giới trẻ."
        },
        {
            "id": 9,
            "name": "Puma Suede Classic",
            "brand": "Puma",
            "price": 85,
            "badge": "CLASSIC",
            "badgeClass": "new-badge",
            "rating": 4.5,
            "reviews": 203,
            "image": "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&auto=format&fit=crop&q=80",
            "sizes": [38, 39, 40, 41, 42, 43],
            "desc": "Được ra mắt năm 1968, Puma Suede Classic là một trong những đôi giày lâu đời nhất và được yêu thích nhất mọi thời đại với chất liệu da lộn mềm mại."
        },
        {
            "id": 10,
            "name": "Puma Nitro Elite",
            "brand": "Puma",
            "price": 200,
            "badge": "NEW",
            "badgeClass": "new-badge",
            "rating": 4.8,
            "reviews": 47,
            "image": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80",
            "sizes": [40, 41, 42, 43, 44],
            "desc": "Đỉnh cao công nghệ chạy bộ của Puma. Nitro Elite sở hữu đế NITRO™ siêu nhẹ và tấm carbon mang lại lực đẩy tối đa cho các vận động viên chuyên nghiệp."
        },
        {
            "id": 11,
            "name": "Asics Gel-Nimbus 25",
            "brand": "Asics",
            "price": 180,
            "badge": "NEW",
            "badgeClass": "new-badge",
            "rating": 4.9,
            "reviews": 76,
            "image": "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80",
            "sizes": [39, 40, 41, 42, 43, 44],
            "desc": "Phiên bản thứ 25 của dòng Nimbus huyền thoại với hệ thống đệm GEL™ cải tiến, mang lại trải nghiệm chạy bộ êm ái nhất từ trước đến nay."
        },
        {
            "id": 12,
            "name": "New Balance 574",
            "brand": "New Balance",
            "price": 100,
            "oldPrice": 120,
            "badge": "SALE",
            "badgeClass": "sale-badge",
            "rating": 4.7,
            "reviews": 289,
            "image": "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&auto=format&fit=crop&q=80",
            "sizes": [39, 40, 41, 42, 43, 44],
            "desc": "New Balance 574 – biểu tượng retro Mỹ với lớp đế ENCAP bền bỉ và phần thân phối hợp da lộn cùng lưới thoáng khí, phù hợp cả đường phố lẫn casual."
        },
        {
            "id": 13,
            "name": "New Balance 990v6",
            "brand": "New Balance",
            "price": 185,
            "badge": "MADE IN USA",
            "badgeClass": "new-badge",
            "rating": 4.9,
            "reviews": 134,
            "image": "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&auto=format&fit=crop&q=80",
            "sizes": [40, 41, 42, 43, 44],
            "desc": "Sản xuất tại Mỹ với tiêu chuẩn thủ công đỉnh cao, New Balance 990v6 kết hợp da mịn, lưới Pigskin và đế ENCAP/ABZORB cho cảm giác đi siêu êm."
        },
        {
            "id": 14,
            "name": "Jordan Air 1 Retro High",
            "brand": "Jordan",
            "price": 220,
            "badge": "HOT",
            "badgeClass": "sale-badge",
            "rating": 5.0,
            "reviews": 478,
            "image": "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&auto=format&fit=crop&q=80",
            "sizes": [40, 41, 42, 43, 44, 45],
            "desc": "Đôi giày định nghĩa nên văn hóa sneaker toàn cầu. Air Jordan 1 Retro High mang đế Air đệm cổ điển, phần thân da cao cấp và câu chuyện di sản bất hủ."
        },
        {
            "id": 15,
            "name": "Jordan Jumpman MVP",
            "brand": "Jordan",
            "price": 130,
            "badge": "NEW",
            "badgeClass": "new-badge",
            "rating": 4.7,
            "reviews": 62,
            "image": "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&auto=format&fit=crop&q=80",
            "sizes": [39, 40, 41, 42, 43, 44],
            "desc": "Cảm hứng từ sân bóng rổ, Jordan Jumpman MVP mang lại sự tự tin và phong cách vượt trội với đế Air và thiết kế năng động hiện đại."
        },
        {
            "id": 16,
            "name": "Converse Chuck Taylor All Star",
            "brand": "Converse",
            "price": 65,
            "badge": "CLASSIC",
            "badgeClass": "new-badge",
            "rating": 4.6,
            "reviews": 892,
            "image": "https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=600&auto=format&fit=crop&q=80",
            "sizes": [37, 38, 39, 40, 41, 42, 43, 44],
            "desc": "Hơn 100 năm lịch sử và vẫn không lỗi mốt. Chuck Taylor All Star là đôi giày vải kinh điển với đế cao su bền bỉ, trở thành biểu tượng văn hóa đại chúng."
        }
    ];
    renderProducts(productsData);
}

function renderProducts(products) {
    const container = document.getElementById('productGridContainer');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = `<p class="section-sub" style="grid-column: 1/-1; text-align: center;">Không tìm thấy sản phẩm nào phù hợp.</p>`;
        return;
    }

    products.forEach(prod => {
        const badgeHTML = prod.badge ? `<span class="product-badge ${prod.badgeClass}">${prod.badge}</span>` : '';
        const oldPriceHTML = prod.oldPrice ? `<span class="old-price">$${prod.oldPrice}</span>` : '';

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${badgeHTML}
            <div class="product-img" onclick="openQuickView(${prod.id})">
                <img src="${prod.image}" alt="${prod.name}">
            </div>
            <div class="product-info">
                <div class="product-brand">${prod.brand}</div>
                <div class="product-name" onclick="openQuickView(${prod.id})">${prod.name}</div>
                <div class="product-rating">
                    <i class="fa-solid fa-star"></i>
                    <span>${prod.rating}</span>
                </div>
                <div class="product-footer">
                    <div class="product-price">${oldPriceHTML}$${prod.price}</div>
                    <button class="add-cart-btn" onclick="directAddToCart(${prod.id})">MUA</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterProducts(brandName) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if (btn.textContent.trim() === brandName) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    if (brandName === 'All') {
        renderProducts(productsData);
    } else {
        const filtered = productsData.filter(p => p.brand.toLowerCase() === brandName.toLowerCase());
        renderProducts(filtered);
    }

    const shopSection = document.getElementById('shop');
    if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase().trim();
        const results = productsData.filter(p => p.name.toLowerCase().includes(keyword) || p.brand.toLowerCase().includes(keyword));
        renderProducts(results);
    });
}

function openQuickView(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;

    activeModalProduct = product;
    currentSelectedSize = product.sizes[0];

    document.getElementById('modalBrand').textContent = product.brand;
    document.getElementById('modalName').textContent = product.name;
    document.getElementById('modalRating').textContent = product.rating;
    document.getElementById('modalReviews').textContent = product.reviews;
    document.getElementById('modalPrice').textContent = '$' + product.price;
    document.getElementById('modalDesc').textContent = product.desc;
    document.getElementById('modalImg').src = product.image;

    const sizeContainer = document.getElementById('modalSizesContainer');
    sizeContainer.innerHTML = '';
    product.sizes.forEach(size => {
        const btn = document.createElement('button');
        btn.className = `size-btn ${size === currentSelectedSize ? 'active' : ''}`;
        btn.textContent = size;
        btn.onclick = () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSelectedSize = size;
        };
        sizeContainer.appendChild(btn);
    });

    document.getElementById('modalAddToCartBtn').onclick = () => {
        addToCart(product.id, currentSelectedSize);
        closeModalDirect();
    };

    document.getElementById('modalOverlay').classList.add('open');
}

function closeModalDirect() {
    document.getElementById('modalOverlay').classList.remove('open');
}

function closeModal(e) {
    if (e.target === document.getElementById('modalOverlay')) {
        closeModalDirect();
    }
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('open');
}

function directAddToCart(id) {
    const product = productsData.find(p => p.id === id);
    addToCart(id, product.sizes[0]);
}

function addToCart(id, size) {
    const product = productsData.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id && item.size === size);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            quantity: 1
        });
    }

    updateCartUI();
    showToast();
}

function updateCartUI() {
    const totalQty = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalQty;

    const cartContainer = document.getElementById('cartItemsContainer');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p class="section-sub" style="text-align:center; padding-top:40px;">Giỏ hàng của bạn đang trống.</p>`;
        document.getElementById('cartTotalPrice').textContent = '$0.00';
        return;
    }

    let totalPrice = 0;

    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name} (Size: ${item.size})</div>
                <div class="cart-item-price">$${item.price} x ${item.quantity}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">Xóa</button>
            </div>
        `;
        cartContainer.appendChild(itemEl);
    });

    document.getElementById('cartTotalPrice').textContent = '$' + totalPrice.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    toast.textContent = msg || 'Đã thêm vào giỏ hàng thành công!';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function checkoutAlert() {
    if (cart.length === 0) {
        alert('Giỏ hàng trống! Hãy chọn sản phẩm trước khi thanh toán.');
        return;
    }
    alert('Cảm ơn bạn đã đặt hàng! Hệ thống đang xử lý hóa đơn.');
    cart = [];
    updateCartUI();
    toggleCart();
}


function initAuth() {
    const saved = localStorage.getItem('sole_user');
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
            updateAuthUI();
        } catch (e) {
            localStorage.removeItem('sole_user');
        }
    }
}

function openAuthModal(tab) {
    switchAuthTab(tab || 'login');
    document.getElementById('authModal').classList.add('open');
    document.getElementById('authOverlay').classList.add('open');
    clearAuthErrors();
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('open');
    document.getElementById('authOverlay').classList.remove('open');
    clearAuthErrors();
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const subtitle = document.getElementById('authSubtitle');

    clearAuthErrors();

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        subtitle.textContent = 'Chào mừng trở lại';
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
        subtitle.textContent = 'Tạo tài khoản mới';
    }
}

function handleLogin(e) {
    e.preventDefault();
    clearAuthErrors();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const accounts = JSON.parse(localStorage.getItem('sole_accounts') || '[]');
    const found = accounts.find(acc => acc.email === email);

    if (!found) {
        showAuthError('loginError', 'Email không tồn tại. Hãy đăng ký tài khoản mới!');
        return;
    }
    if (found.password !== btoa(password)) {
        showAuthError('loginError', 'Mật khẩu không chính xác. Vui lòng thử lại!');
        return;
    }

    const remember = document.getElementById('rememberMe').checked;
    currentUser = { name: found.name, email: found.email };

    if (remember) {
        localStorage.setItem('sole_user', JSON.stringify(currentUser));
    } else {
        sessionStorage.setItem('sole_user', JSON.stringify(currentUser));
    }

    closeAuthModal();
    updateAuthUI();
    showToast('Đăng nhập thành công! Chào ' + found.name.split(' ').pop() + ' 👋');
}

function handleRegister(e) {
    e.preventDefault();
    clearAuthErrors();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;

    if (name.length < 2) {
        showAuthError('registerError', 'Vui lòng nhập họ tên hợp lệ (ít nhất 2 ký tự).');
        return;
    }
    if (password.length < 6) {
        showAuthError('registerError', 'Mật khẩu phải có ít nhất 6 ký tự.');
        return;
    }
    if (password !== confirm) {
        showAuthError('registerError', 'Xác nhận mật khẩu không khớp!');
        return;
    }

    const accounts = JSON.parse(localStorage.getItem('sole_accounts') || '[]');
    if (accounts.find(acc => acc.email === email)) {
        showAuthError('registerError', 'Email này đã được đăng ký. Hãy đăng nhập!');
        return;
    }

    accounts.push({ name, email, password: btoa(password) });
    localStorage.setItem('sole_accounts', JSON.stringify(accounts));

    currentUser = { name, email };
    localStorage.setItem('sole_user', JSON.stringify(currentUser));

    closeAuthModal();
    updateAuthUI();
    showToast('Tạo tài khoản thành công! Chào mừng ' + name.split(' ').pop() + ' 🎉');
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('sole_user');
    sessionStorage.removeItem('sole_user');
    document.getElementById('userDropdown').classList.remove('open');
    updateAuthUI();
    showToast('Đã đăng xuất. Hẹn gặp lại!');
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginNavBtn');
    const avatarWrap = document.getElementById('userAvatarWrap');

    if (currentUser) {
        loginBtn.classList.add('hidden');
        avatarWrap.classList.remove('hidden');

        const initial = currentUser.name.trim().charAt(0).toUpperCase();
        const shortName = currentUser.name.split(' ').pop();

        document.getElementById('userAvatarInitial').textContent = initial;
        document.getElementById('userDisplayName').textContent = shortName;
        document.getElementById('dropdownName').textContent = currentUser.name;
        document.getElementById('dropdownEmail').textContent = currentUser.email;
    } else {
        loginBtn.classList.remove('hidden');
        avatarWrap.classList.add('hidden');
    }
}

function toggleUserMenu() {
    document.getElementById('userDropdown').classList.toggle('open');
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function showAuthError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = message;
}

function clearAuthErrors() {
    ['loginError', 'registerError'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });
}

function socialLogin(provider) {
    closeAuthModal();
    showToast('Đăng nhập ' + provider + ' — tính năng sắp ra mắt!');
}
