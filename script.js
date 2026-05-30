// Khai báo các biến toàn cục quản lý trạng thái ứng dụng
let productsData = [];
let cart = [];
let currentSelectedSize = null;
let activeModalProduct = null;
let currentUser = null;

// Khởi chạy ứng dụng khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    fetchProducts();
    setupSearch();
    initAuth();

    // Đóng user dropdown khi click ra ngoài
    document.addEventListener('click', (e) => {
        const wrap = document.getElementById('userAvatarWrap');
        if (wrap && !wrap.contains(e.target)) {
            document.getElementById('userDropdown').classList.remove('open');
        }
    });
});

/* 1. HIỆU ỨNG CON TRỎ CHUỘT (CUSTOM CURSOR) */
function initCursor() {
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Tạo hiệu ứng phóng to con trỏ khi tương tác các phần tử Clickable
    const clickables = document.querySelectorAll('a, button, .product-card, .brand-item');
    clickables.forEach(item => {
        item.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(2.5)');
        item.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
    });
}

/* 2. ĐỌC DỮ LIỆU TỪ FILE JSON */
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
            "image": "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80",
            "sizes": [41, 42, 43, 44],
            "desc": "Công nghệ 4D Guidance System đem lại sự ổn định tuyệt đối và lớp đệm FF BLAST™ PLUS ECO cho trải nghiệm êm ái đỉnh cao."
        }
    ];
    renderProducts(productsData);
}

/* 3. ĐỔ SẢN PHẨM RA HTML CHUYÊN NGHIỆP */
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

/* 4. CHỨC NĂNG LỌC SẢN PHẨM */
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
}

/* 5. TÌM KIẾM THEO TÊN GIÀY */
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase().trim();
        const results = productsData.filter(p => p.name.toLowerCase().includes(keyword) || p.brand.toLowerCase().includes(keyword));
        renderProducts(results);
    });
}

/* 6. POPUP XEM CHI TIẾT SẢN PHẨM (QUICK VIEW) */
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

/* 7. XỬ LÝ LOGIC GIỎ HÀNG (CART LOGIC) */
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

/* 8. HIỂN THỊ THÔNG BÁO TOAST */
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

/* =============================================
   9. HỆ THỐNG ĐĂNG NHẬP / ĐĂNG KÝ (AUTH)
   ============================================= */

function initAuth() {
    // Kiểm tra phiên đăng nhập đã lưu
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

    // Lấy danh sách tài khoản đã đăng ký
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

    // Đăng nhập thành công
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

    // Lưu tài khoản mới
    accounts.push({ name, email, password: btoa(password) });
    localStorage.setItem('sole_accounts', JSON.stringify(accounts));

    // Đăng nhập luôn sau khi đăng ký
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
